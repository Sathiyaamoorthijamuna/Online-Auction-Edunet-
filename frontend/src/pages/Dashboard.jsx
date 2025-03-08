import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [winners, setWinners] = useState({});

  const fetchWinnerDetails = async (winnerIds) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching winner details for IDs:", winnerIds); // Debugging

      const response = await fetch(`http://localhost:5000/api/users/winners`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ winnerIds })
      });

      const data = await response.json();
      console.log("Winner data received:", data); // Debugging

      if (Array.isArray(data)) {
        const winnerMap = {};
        data.forEach(user => {
          winnerMap[user._id] = user.name;
        });

        setWinners(prev => ({ ...prev, ...winnerMap }));
        console.log("Updated winners state:", winnerMap); // Debugging
      }
    } catch (error) {
      console.error("Error fetching winners:", error);
    }
};


useEffect(() => {
  const fetchAuctions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/auctions", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Auctions received:", data); // Debugging
        setAuctions(data);

        // Extract unique winner IDs
        const winnerIds = [...new Set(
          data.map(auction => auction.winner).filter(winner => winner && winner !== "No Winner")
      )];
      
        console.log("Winner IDs to fetch:", winnerIds); // Debugging

        if (winnerIds.length > 0) {
          await fetchWinnerDetails(winnerIds);
        }
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  fetchAuctions();
  const interval = setInterval(fetchAuctions, 5000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="dashboard-container">
      <h2>Auction Dashboard</h2>
      <div className="auction-list">
        {auctions.map((auction) => {
          const isAuctionClosed = new Date(auction.auctionTime) < new Date();
          
          return (
            <div key={auction._id} className="dashboard-card">
              <img 
                src={`http://localhost:5000/${auction.image}`} 
                alt={auction.itemName} 
              />
              <h3>{auction.itemName}</h3>
              <p><strong>Current Bid:</strong> ₹{auction.highestBid || auction.amount}</p>
              <p>
                <strong>Status:</strong> {isAuctionClosed ? 'Closed' : 'Active'}
                <br />
                {isAuctionClosed && auction.winner && (
                  <strong>Winner: {winners[auction.winner] || "No Winner"}</strong>
                )}
                {!isAuctionClosed && (
                  <small>Ends: {new Date(auction.auctionTime).toLocaleString()}</small>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
