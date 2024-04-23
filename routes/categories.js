const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Movie = require('../models/movie');


router.post('/', async (req, res) => {

    const category = new Category({
        name: req.body.name
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('categories');
        if (!movie) return res.status(404).send('Movie not found');
        res.json(movie.categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:categoryId/movies', async (req, res) => {
    try {
        const movies = await Movie.find({ categories: req.params.categoryId });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
