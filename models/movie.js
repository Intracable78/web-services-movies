const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 128 },
    description: { type: String, required: true, maxlength: 2048 },
    parutionDate: { type: Date, required: true },
    note: { type: Number, min: 0, max: 5, required: false },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
});

module.exports = mongoose.model('Movie', movieSchema);