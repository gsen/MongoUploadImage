const { Mongoose } = require("mongoose");

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    data: { type: Buffer, required: true },
    name: { type: String, required: true },
    contentType: { type: String }
});

module.exports = mongoose.model('Image', imageSchema);