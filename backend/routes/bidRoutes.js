const express = require('express');
const { placeBid, getHighestBid } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/place', protect, placeBid);
router.get('/highest/:auctionId', getHighestBid);

module.exports = router;
