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
import routes from "../frontend/routes/serverRoutes";
import reducer from "../frontend/reducers";
import initialState from "../frontend/initialState";
import config from "./config";
import getManifest from "./getManifest";

const app = express();

const { env, port } = config;

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

const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  );

  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.get("*", renderApp);

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`server is running on port ${port}`);
});
