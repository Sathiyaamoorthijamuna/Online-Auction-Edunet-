const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    auctionTime: { type: String, required: true },
    image: { type: String, required: true },
    highestBid: { type: Number, required: true },
    winner: { type: String, default: "" },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    }
});

module.exports = mongoose.model("Auction", auctionSchema);

