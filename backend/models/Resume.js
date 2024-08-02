const mongoose = require('mongoose');
const reviewSchema = require('./Review.js')
const resumeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeFile: { type: String, required: true },
    reviews: [reviewSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resume', resumeSchema);
