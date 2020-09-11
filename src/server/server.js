/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable global-require */
import express from "express";
import webpack from "webpack";
import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { renderRoutes } from "react-router-config";
import { StaticRouter } from "react-router-dom";
//import helmet from "helmet";
//se desactivo el helmet porque generaba problemas para cargar la pagina del lado del cliente
import cookieParser from "cookie-parser";
import boom from "@hapi/boom";
import passport from "passport";
import axios from "axios";
import dotenv from "dotenv";

import serverRoutes from "../frontend/routes/serverRoutes";
import reducer from "../frontend/reducers";
import getManifest from "./getManifest";

dotenv.config();

const app = express();

const port = process.env.PORT;
const env = process.env.ENV;

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require("./utils/auth/strategies/basic");

if (env === "development") {
  console.log("Development config");
  const webpackConfig = require("../../webpack.config");
  const webpackDevMiddlewar = require("webpack-dev-middleware");
  const webpackHotMiddlewar = require("webpack-hot-middleware");
  const compiler = webpack(webpackConfig);
  const serverConfig = { port, hot: true };

  app.use(webpackDevMiddlewar(compiler, serverConfig));
  app.use(webpackHotMiddlewar(compiler));
} else {
  console.log("Production config");
  app.use((req, res, next) => {
    if (!req.hashManifest) req.hashManifest = getManifest();
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  /* app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable("x-powered-by"); */
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest["main.css"] : "assets/app.css";
  const mainBuild = manifest ? manifest["main.js"] : "assets/app.js";
  const vendorBuild = manifest ? manifest["vendors.js"] : "assets/vendor.js";

  return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href=${mainStyles} type="text/css">
        <title>PlatziVideo</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            "\\u003c"
          )}
        </script>
        <script src=${mainBuild} type="text/javascript"></script>
        <script src=${vendorBuild} type="text/javascript"></script>
      </body>
    </html>
  `;
};

const renderApp = async (req, res) => {
  let initialState;
  const { token, email, name, id } = req.cookies;

  try {
    let movieList = await axios({
      url: `${process.env.API_URL}/api/movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: "get",
    });

    movieList = movieList.data.data;

    let userMovieList = await axios({
      url: `${process.env.API_URL}/api/user-movies/?userId=${id}`,
      headers: { Authorization: `Bearer ${token}` },
      method: "get",
    });

    userMovieList = userMovieList.data.data;

    const myList = [];

    userMovieList.forEach((userMovie) => {
      movieList.forEach((movie) => {
        if (userMovie.movieId === movie._id) {
          movie.userMovieId = userMovie._id;
          myList.push(movie);
        }
      });
    });

    initialState = {
      user: {
        id,
        email,
        name,
      },
      myList,
      trends: movieList.filter(
        (movie) => movie.contentRating === "PG" && movie._id
      ),
      originals: movieList.filter(
        (movie) => movie.contentRating === "G" && movie._id
      ),
      mySearch: [],
    };
  } catch (error) {
    initialState = {
      user: {},
      myList: [],
      trends: [],
      originals: [],
      mySearch: [],
    };
  }

  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = !!initialState.user.id;
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes(isLogged))}
      </StaticRouter>
    </Provider>
  );

  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.post("/auth/sign-in", async (req, res, next) => {
  passport.authenticate("basic", (error, data) => {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async (err) => {
        if (err) {
          next(err);
        }

        const { token, ...user } = data;

        res.cookie("token", token, {
          httpOnly: !(env === "development"),
          secure: !(env === "development"),
        });

        res.status(200).json(user);
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

app.post("/auth/sign-up", async (req, res, next) => {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${process.env.API_URL}/api/auth/sign-up`,
      method: "post",
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });
    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id,
    });
  } catch (error) {
    next(error);
  }
});

//Ruta de CreateUserMovies
app.post("/user-movies", async (req, res, next) => {
  try {
    const { body: userMovie } = req;
    const { id, token } = req.cookies;

    const { data, status } = await axios({
      url: `${process.env.API_URL}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: "post",
      data: {
        userId: id,
        movieId: userMovie.movieId,
      },
      withCredentials: true,
    });

    if (status !== 201) {
      return next(boom.badImplementation());
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

//Ruta de DeleteUserMovies
app.delete("/user-movies/:userMovieId", async (req, res, next) => {
  try {
    const { userMovieId } = req.params;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${process.env.API_URL}/api/user-movies/${userMovieId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: "delete",
    });

    if (status !== 200) {
      return next(boom.badImplementation());
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.get("*", renderApp);

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`${env} server is running on port ${port}`);
});
