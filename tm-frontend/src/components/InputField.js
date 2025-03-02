import React, { useState } from "react";
import "../styles/InputField.css"; 
import eyeOpen from "../Assets/Eye.png";
import eyeClosed from "../Assets/Invisible.png";

const InputField = ({ type, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="input-container">
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {type === "password" && (
        <img
          src={showPassword ? eyeOpen : eyeClosed}
          alt="Toggle visibility"
          className="eye-icon"
          onClick={togglePasswordVisibility}
        />
      )}
    </div>
  );
};

export default InputField;
