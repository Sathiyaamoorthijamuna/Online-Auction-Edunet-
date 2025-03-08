import React, { useEffect, useState } from "react";
import { getAuctions } from "../api/api";

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuctions = async () => {
            const data = await getAuctions();
            setAuctions(data.auctions || []);
            setLoading(false);
        };
        fetchAuctions();
    }, []);

    if (loading) return <p>Loading auctions...</p>;

    return (
        <div>
            <h2>Live Auctions</h2>
            {auctions.length === 0 ? (
                <p>No auctions available.</p>
            ) : (
                <ul>
                    {auctions.map((auction) => (
                        <li key={auction._id}>
                            <h3>{auction.title}</h3>
                            <p>{auction.description}</p>
                            <p>Starting Bid: ${auction.startingBid}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AuctionList;
