import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "../api/auth"; 
import "./Signin.css";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await loginUser(formData);

    if (response.error) {
      setError(response.error);
    } else {
      localStorage.setItem("token", response.token); 
      localStorage.setItem("userId", response.userId);
      navigate("/dashboard"); 
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign In</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />

          <div className="signin-options">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <p className="signup-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

        <div className="google-signin">
          <button className="google-btn">
            <FcGoogle className="google-icon" /> Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
