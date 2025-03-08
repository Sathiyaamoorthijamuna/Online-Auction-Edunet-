import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";  
import { registerUser } from "../api/auth"; // Import API function
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const response = await registerUser(formData);

    if (response.error) {
      setError(response.error);
    } else {
      setSuccess("Signup successful!");
      setTimeout(() => navigate("/signin"), 2000); // Redirect after 2 seconds
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Signup</h2>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <button type="submit" className="signup-btn">Signup</button>
        </form>

        <p className="signin-text">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>

        <div className="google-signin">
          <button className="google-btn">
            <FcGoogle className="google-icon" /> Signup with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
