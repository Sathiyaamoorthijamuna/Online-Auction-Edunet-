const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true }, // 👈 Add sparse: true
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);



