const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auctions', require('./routes/auctionRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use("/uploads", express.static("uploads"));


// app.listen(5000, () => console.log(`Server running on port 5000`));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
