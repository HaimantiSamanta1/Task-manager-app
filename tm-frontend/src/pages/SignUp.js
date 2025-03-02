import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Auth.css";
import InputField from "../components/InputField";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sign Up button clicked");

    try {
      const response = await signup(email, password);
      setMessage(response.message);
      setIsSuccess(response.success);
      if (response.success) {
        setEmail("");
        setPassword("");
      } 
    } catch (error) {
      setMessage("Something went wrong!");
      setIsSuccess(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {message && (
        <p style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
       <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
