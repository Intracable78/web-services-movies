const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    nom: { type: String, required: true, maxlength: 128 },
    description: { type: String, required: true, maxlength: 2048 },
    dateDeParution: { type: Date, required: true },
    note: { type: Number, min: 0, max: 5, required: false }
});

module.exports = mongoose.model('Movie', movieSchema);