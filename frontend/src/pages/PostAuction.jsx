import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAuction } from "../api/auction"; // Ensure this file exists
import "./PostAuction.css";

const PostAuction = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    amount: "",
    auctionTime: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token"); // Get token

    if (!token) {
      setError("Unauthorized: No token found");
      return;
    }

    // Convert to FormData
    const auctionData = new FormData();
    auctionData.append("itemName", formData.itemName);
    auctionData.append("description", formData.description);
    auctionData.append("amount", formData.amount);
    auctionData.append("auctionTime", formData.auctionTime);
    auctionData.append("image", formData.image);

    try {
      const response = await createAuction(auctionData, token); // Pass token
      console.log("Auction Response:", response);

      if (response.error) {
        setError(response.error);
      } else {
        alert("Auction posted successfully!");
        navigate("/auction-details");
      }
    } catch (err) {
      console.error("Auction creation failed:", err);
      setError("Auction creation failed. Please try again.");
    }
  };

  return (
    <div className="post-auction-container">
      <h2>Post an Auction</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Starting Amount (₹)" value={formData.amount} onChange={handleChange} required />
        <input type="datetime-local" name="auctionTime" value={formData.auctionTime} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleImageUpload} required />
        {preview && <img src={preview} alt="Auction Preview" className="preview-image" />}
        <button type="submit">Post Auction</button>
      </form>
    </div>
  );
};

export default PostAuction;
