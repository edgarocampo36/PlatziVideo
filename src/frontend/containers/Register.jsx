/* eslint-disable react/button-has-type */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../actions";
import Header from "../components/Header";
import "../assets/styles/components/Register.scss";

const Register = (props) => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.registerUser(form, "/login");
  };

  return (
    <section className="register">
      <Header setColor="green" />
      <section className="register__container">
        <h2>Regístrate</h2>
        <form className="register__container--form" onSubmit={handleSubmit}>
          <input
            className="input"
            name="name"
            type="text"
            placeholder="Nombre"
            onChange={handleInput}
          />
          <input
            className="input"
            name="email"
            type="text"
            placeholder="Correo"
            onChange={handleInput}
          />
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleInput}
          />
          <button className="button" type="submit">
            Registrarme
          </button>
        </form>
        <Link to="/login">Iniciar sesión</Link>
      </section>
    </section>
  );
};

const mapDispatchToProps = {
  registerUser,
};

Register.propTypes = {
  registerUser: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(Register);
