import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setFavorite, deleteFavorite } from "../actions/index";
import "../assets/styles/components/CarouselItem.scss";

import playIcon from "../assets/static/play-icon.png";
import plusIcon from "../assets/static/plus-icon.png";
import deleteIcon from "../assets/static/delete-icon.png";

const CarouselItem = (props) => {
  const {
    _id,
    cover,
    title,
    year,
    contentRating,
    duration,
    userMovieId,
    isList,
  } = props;

  const handleSetFavorite = () => {
    props.setFavorite({
      _id,
      cover,
      title,
      year,
      contentRating,
      duration,
    });
  };

  const handleDeleteFavorite = () => {
    props.deleteFavorite(userMovieId);
  };

  return (
    <div className="carousel-item">
      <img className="carousel-item__img" src={cover} alt={title} />
      <div className="carousel-item__details">
        <div>
          <Link to={`/player/${_id}`}>
            <img
              className="carousel-item__details--img"
              src={playIcon}
              alt="Play Icon"
            />
          </Link>
          {isList ? (
            <img
              className="carousel-item__details--img"
              src={deleteIcon}
              alt="Delete Icon"
              onClick={handleDeleteFavorite}
            />
          ) : (
            <img
              className="carousel-item__details--img"
              src={plusIcon}
              alt="Plus Icon"
              onClick={handleSetFavorite}
            />
          )}
        </div>
        <p className="carousel-item__details--title">{title}</p>
        <p className="carousel-item__details--subtitle">
          {`${year} ${contentRating} ${duration}`}
        </p>
      </div>
    </div>
  );
};

CarouselItem.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  contentRating: PropTypes.string,
  duration: PropTypes.number,
};

const mapDispatchToProps = {
  setFavorite,
  deleteFavorite,
};

export default connect(null, mapDispatchToProps)(CarouselItem);
