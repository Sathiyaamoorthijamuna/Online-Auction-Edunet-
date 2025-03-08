import React, { useState } from "react";
import { placeBid } from "../api/api";

const PlaceBid = ({ auctionId, token }) => {
    const [bidAmount, setBidAmount] = useState("");

    const handleBid = async () => {
        if (!bidAmount) {
            alert("Please enter a bid amount");
            return;
        }

        const result = await placeBid(auctionId, bidAmount, token);
        if (result) {
            alert("Bid placed successfully!");
        } else {
            alert("Error placing bid. Try again.");
        }
    };

    return (
        <div>
            <input
                type="number"
                placeholder="Enter bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
            />
            <button onClick={handleBid}>Place Bid</button>
        </div>
    );
};

export default PlaceBid;
