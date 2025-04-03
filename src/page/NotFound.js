import React from "react";
import "../NotFound.scss";
import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="containers">
      {[...Array(40)].map((_, i) => (
        <span className="particle" key={`particle4-${i}`}>
          4
        </span>
      ))}
      {[...Array(40)].map((_, i) => (
        <span className="particle" key={`particle0-${i}`}>
          0
        </span>
      ))}

      <article className="content">
        <p>Damnit stranger,</p>
        <p>
          You got lost in the <strong>404</strong> Suvira Energy.
        </p>
        <p>
          <button onClick={() => navigate("/")}>Go back to Suvira Energy.</button>
        </p>
      </article>
    </main>
  );
}

export default NotFound;
