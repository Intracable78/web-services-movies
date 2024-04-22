const express = require('express');
const Movie = require('../models/movie');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
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
    const movie = new Movie({
        nom: req.body.nom,
        description: req.body.description,
        dateDeParution: req.body.dateDeParution,
        note: req.body.note
    });
    try {
        const newMovie = await movie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(422).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('Movie not found');
        movie.nom = req.body.nom;
        movie.description = req.body.description;
        movie.dateDeParution = req.body.dateDeParution;
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