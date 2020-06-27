import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import PropTypes from "prop-types";
import { getVideoSearch } from "../actions";
import "../assets/styles/components/Search.scss";

const Search = ({ isHome, getVideoSearch }) => {
  const inputStyle = classNames("input", {
    isHome,
  });

  const handleInput = (event) => {
    getVideoSearch(event.target.value);
  };

  return (
    <section className="main">
      <h2 className="main__title">¿Qué quieres ver hoy?</h2>
      <input
        type="text"
        className={inputStyle}
        placeholder="Buscar..."
        onChange={handleInput}
      />
    </section>
  );
};

Search.propTypes = {
  isHome: PropTypes.bool,
  getVideoSearch: PropTypes.func,
};

const mapDispatchToProps = {
  getVideoSearch,
};

export default connect(null, mapDispatchToProps)(Search);
