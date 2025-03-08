const mongoose = require("mongoose");
const express = require('express');
const User = require("../models/userModel");
const { 
    registerUser, 
    loginUser, 
    getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
// router.get('/winner/:id', protect, getWinnerDetails);

router.post("/winners", async (req, res) => {
    try {
        const { winnerIds } = req.body;
        console.log("Received winnerIds:", winnerIds); // Debugging

        if (!winnerIds || winnerIds.length === 0) {
            console.log("No winner IDs provided");
            return res.json([]);
        }

        // **Filter out invalid ObjectIds**
        const validWinnerIds = winnerIds.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validWinnerIds.length === 0) {
            console.log("No valid ObjectIds found");
            return res.json([]);
        }

        // Fetch users from database
        const users = await User.find({ _id: { $in: validWinnerIds } }).select("_id name");
        console.log("Fetched users:", users); // Debugging

        res.json(users);
    } catch (error) {
        console.error("Error fetching winner details:", error);
        res.status(500).json({ message: "Error fetching winner details", error });
    }
});

module.exports = router;