const express = require('express');
const Movie = require('../models/movie');
const router = express.Router();

router.get('/', async (req, res) => {
    const { title, description, page = 1, limit = 10 } = req.query;
    let query = {};
    if (title) {
        query.name = { $regex: title, $options: 'i' }; // Recherche insensible à la casse
    }
    if (description) {
        query.description = { $regex: description, $options: 'i' };
    }

    try {
        const movies = await Movie.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const count = await Movie.countDocuments(query);
        res.json({
            movies,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('Movie not found');
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const { name, description, parutionDate, note, categories } = req.body;
    const movie = new Movie({
        name,
        description,
        parutionDate,
        note,
        categories
    });

    try {
        const newMovie = await movie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('Movie not found');
        movie.name = req.body.name;
        movie.description = req.body.description;
        movie.parutionDate = req.body.parutionDate;
        movie.note = req.body.note;
        await movie.save();
        res.json(movie);
    } catch (err) {
        res.status(422).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('Movie not found');
        await movie.remove();
        res.json({ message: 'Deleted Movie' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;