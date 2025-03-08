import axios from "axios";

const API_URL = "/api"; 
// Get all auctions
export const getAllAuctions = async () => {
    try {
        const response = await axios.get(`${API_URL}/auctions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching auctions:", error);
        return { auctions: [] };
    }
};

// Create an auction
export const createAuction = async (auctionData) => {
    try {
        const response = await axios.post(`${API_URL}/auctions/create`, auctionData);
        return response.data;
    } catch (error) {
        console.error("Error creating auction:", error);
        return null;
    }
};

// Place a bid
export const placeBid = async (auctionId, bidAmount) => {
    try {
        const response = await axios.post(`${API_URL}/bids/place`, { auctionId, bidAmount });
        return response.data;
    } catch (error) {
        console.error("Error placing bid:", error);
        return null;
    }
};

// Get highest bid for an auction
export const getHighestBid = async (auctionId) => {
    try {
        const response = await axios.get(`${API_URL}/bids/highest/${auctionId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching highest bid:", error);
        return null;
    }
};
