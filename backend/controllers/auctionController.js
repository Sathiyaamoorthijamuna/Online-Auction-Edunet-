const Auction = require("../models/auctionModel");

// Create Auction
const createAuction = async (req, res) => {
    try {
        const { itemName, description, amount, auctionTime } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        if (!itemName || !description || !amount || !auctionTime || !imageUrl) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const auction = new Auction({
            itemName,
            description,
            amount: parseFloat(amount),
            auctionTime,
            image: imageUrl,
            highestBid: parseFloat(amount),
            winner: "",
        });

        await auction.save();
        res.status(201).json({ message: "Auction created successfully!", auction });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find()
            .select("itemName description amount auctionTime image highestBid winner status")
            .populate('winner', 'username email') // Add this line to get winner details
            .sort({ createdAt: -1 });
        
        console.log("Fetched auctions:", auctions);
        res.status(200).json(auctions);
    } catch (error) {
        console.error("Error fetching auctions:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const closeAuction = async (req, res) => {
    try {
        const { auctionId } = req.params;

        const auction = await Auction.findById(auctionId);
        if (!auction) return res.status(404).json({ message: "Auction not found" });

        // Check if auction has ended
        const now = new Date();
        const auctionEndTime = new Date(auction.auctionTime);
        
        if (auctionEndTime > now) {
            return res.status(400).json({ message: "Auction is still active" });
        }

        if (auction.highestBid > auction.amount) {
            auction.status = 'closed';
            await auction.save();
            
            console.log(`Auction ${auctionId} closed with winner:`, auction.winner);
            res.status(200).json({
                message: "Auction closed successfully",
                winner: auction.winner
            });
        } else {
            auction.status = 'closed';
            auction.winner = null;
            await auction.save();
            
            res.status(200).json({
                message: "Auction closed with no winner",
                winner: null
            });
        }
    } catch (error) {
        console.error("Error closing auction:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//get winners
const getWinners = async (req, res) => {
    try {
        const closedAuctions = await Auction.find({ winner: { $ne: null } })
            .populate("winner", "username");

        res.status(200).json({ closedAuctions });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateBid = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const { bidAmount, userId } = req.body;

        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        if (new Date(auction.auctionTime) < new Date()) {
            return res.status(400).json({ message: "Auction has ended" });
        }
        if (bidAmount <= auction.highestBid) {
            return res.status(400).json({ message: "Bid must be higher than current highest bid" });
        }

        auction.highestBid = bidAmount;
        auction.winner = userId;
        await auction.save();

        console.log(`Bid updated for auction ${auctionId}:`, auction);
        res.status(200).json({ message: "Bid updated successfully", auction });
    } catch (error) {
        console.error("Error updating bid:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createAuction, getAllAuctions, closeAuction, getWinners,updateBid };
