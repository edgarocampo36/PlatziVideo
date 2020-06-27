import React from "react";
import "../assets/styles/components/NotFoundMessage.scss";

const NotFoundMessage = () => (
  <section className="error">
    <div className="error_container">
      <div className="error_animation">
        <p className="error_container_404">Error 404!</p>
      </div>
      <p className="error_container_text">Página no encontrada</p>
    </div>
  </section>
);

export default NotFoundMessage;
