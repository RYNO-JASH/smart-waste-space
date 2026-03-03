const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
    wasteType: {
        type: String,
        required: [true, 'Waste type is required'],
        trim: true,
    },
    classification: {
        type: String,
        required: true,
    },
    recommendedPath: {
        type: String,
        required: true,
    },
    efficiency: {
        type: Number,
        required: true,
    },
    finalProduct: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Waste', wasteSchema);
