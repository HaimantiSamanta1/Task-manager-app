import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "../styles/Home.css"; 

const Home = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.includes("@")) newErrors.email = "Invalid email";
    if (formData.password.length < 6) newErrors.password = "Password too short";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      alert("Login Successful!");
      navigate("/dashboard"); 
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="home-container">
      <h2>Welcome to Task Manager</h2>
      <div className="card">
        <h3>Sign In</h3>
        <form onSubmit={handleSubmit}>
          <InputField label="Email:" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
          
          <InputField 
            label="Password:" 
            type={showPassword ? "text" : "password"} 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            error={errors.password} 
            showPasswordToggle={() => setShowPassword(!showPassword)}
          />

          <Button text="Login" type="submit" />
          <p className="text-center">
            Don't have an account? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/signup")}>Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Home;
