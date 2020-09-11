import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getVideoSource } from "../actions";
import "../assets/styles/components/Player.scss";

const Player = (props) => {
  const { match, playing } = props;
  const { id } = match.params;

  const hasPlaying = Object.keys(playing).length > 0;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    props.getVideoSource(id);
    setLoading(false);
  }, []);

  const handleClick = () => {
    props.history.goBack();
  };

  if (loading) {
    return (
      <div className="Loading">
        <h1>Cargando video...</h1>
      </div>
    );
  }

  return hasPlaying ? (
    <div className="Player">
      <video controls autoPlay>
        <source src={playing.source} type="video/mp4" />
      </video>
      <div className="Player-back">
        <button type="button" onClick={handleClick}>
          Regresar
        </button>
      </div>
    </div>
  ) : (
    <Redirect to="/404" />
  );
};

const mapStateToProps = (state) => ({
  playing: state.playing,
});

const mapDispatchToProps = {
  getVideoSource,
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
