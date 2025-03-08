import React, { useEffect, useState } from "react";
import "./AuctionDetails.css";

const AuctionDetails = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auctions");
        const data = await response.json();
        setAuctions(data || []);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setAuctions([]);
      }
    };

    fetchAuctions();
  }, []);

const handleBid = async (auctionId, currentBid) => {
  const token = localStorage.getItem("token"); // Get JWT token

  if (!token) {
      alert("You must be logged in to place a bid.");
      return;
  }

  const newBid = parseFloat(prompt("Enter your bid amount:", currentBid + 1));

  if (!newBid || newBid <= currentBid) {
      alert("Please enter a valid bid higher than the current bid.");
      return;
  }

  try {
      const response = await fetch("http://localhost:5000/api/bids/place", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send JWT token
          },
          body: JSON.stringify({ auctionId, bidAmount: newBid }),
      });

      const result = await response.json();

      if (response.ok) {
          alert("Bid placed successfully!");
          setAuctions((prevAuctions) =>
              prevAuctions.map((auction) =>
                  auction._id === auctionId ? { ...auction, currentBid: result.updatedBid } : auction
              )
          );
      } else {
          alert(result.message || "Failed to place bid.");
      }
  } catch (error) {
      console.error("Error placing bid:", error);
      alert("Error placing bid. Please try again.");
  }
};

  return (
    <div className="auction-details-container">
      <h2>Live Auctions</h2>
      <div className="auction-cards">
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <div key={auction._id} className="auction-card">
              {/* <img src={auction.image} alt={auction.itemName} /> */}
              <img src={`http://localhost:5000/${auction.image}`} alt={auction.itemName} />
              <h3>{auction.itemName}</h3>
              <p>{auction.description}</p>
              <p><strong>Current Bid:</strong> ₹{auction.highestBid || auction.amount}</p>

              <p><strong>Closing Date:</strong> {new Date(auction.auctionTime).toLocaleString()}</p>
              <button onClick={() => handleBid(auction._id, auction.currentBid)}>Bid Now</button>
            </div>
          ))
        ) : (
          <p>No auctions available.</p>
        )}
      </div>
    </div>
  );
};

export default AuctionDetails;
