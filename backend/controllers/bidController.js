const Bid = require('../models/bidModel');
const Auction = require('../models/auctionModel');
const User = require('../models/userModel');

const placeBid = async (req, res) => {
    try {
        const { auctionId, bidAmount } = req.body;
        const userId = req.user._id; 
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
        const currentTime = new Date();
        const auctionEndTime = new Date(auction.auctionTime);

        if (currentTime >= auctionEndTime) {
            return res.status(400).json({ message: "Bidding time is over!" });
        }

        if (bidAmount <= auction.highestBid) {
            return res.status(400).json({ message: "Bid must be higher than the current highest bid" });
        }

        const newBid = new Bid({
            auction: auctionId,
            user: userId,
            bidAmount: bidAmount
        });

        await newBid.save();

        // Update the auction with the highest bid and highest bidder
        auction.highestBid = bidAmount;
        auction.winner = userId; 

        await auction.save();

        res.json({ message: "Bid placed successfully!", updatedBid: bidAmount });
    } catch (error) {
        res.status(500).json({ message: "Error placing bid", error: error.message });
    }
};

const declareWinners = async () => {
    try {
        const currentTime = new Date();
        const expiredAuctions = await Auction.find({ auctionTime: { $lte: currentTime }, winner: "" });

        for (const auction of expiredAuctions) {
            if (auction.highestBid > auction.amount) {
                // Set winner to the highest bidder
                const winnerUser = await User.findById(auction.winner);
                auction.winner = winnerUser ? winnerUser.name : "No Winner"; 
            } else {
                auction.winner = "No Winner";
            }
            await auction.save();
        }
    } catch (error) {
        console.error("Error declaring winners:", error);
    }
};

setInterval(declareWinners, 60000);


// Get Highest Bid for an Auction
const getHighestBid = async (req, res) => {
    try {
        const { auctionId } = req.params;

        const auctionExists = await Auction.findById(auctionId);
        if (!auctionExists) {
            return res.status(404).json({ message: "Auction not found" });
        }
        
        const highestBid = await Bid.findOne({ auction: auctionId })
            .sort({ bidAmount: -1 })
            .populate('user', 'name'); 

        if (!highestBid) {
            return res.status(404).json({ message: 'No bids found for this auction' });
        }

        res.status(200).json({ highestBid });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { placeBid, getHighestBid };

