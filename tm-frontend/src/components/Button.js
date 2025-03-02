import React from "react";
import "../styles/Button.css"; // Ensure CSS is linked

const Button = ({ text, type }) => {
  return (
    <button className="btn" type={type}>
      {text}
    </button>
  );
};

export default Button;
