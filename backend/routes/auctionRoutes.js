const express = require("express");
const multer = require("multer");
const { createAuction, getAllAuctions,closeAuction,getWinners} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// Create an auction
router.post("/create", protect,upload.single("image"), createAuction);
// router.post('/create', protect, createAuction);
router.get('/', getAllAuctions);
router.patch('/close/:auctionId', closeAuction);
router.get('/winners', getWinners);
module.exports = router;




