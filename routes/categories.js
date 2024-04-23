const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Movie = require('../models/movie');

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crée une nouvelle catégorie
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Action
 *     responses:
 *       201:
 *         description: La catégorie a été créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Requête invalide
 */

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

/**
 * @swagger
 * /categories/{categoryId}/movies:
 *   get:
 *     summary: Récupère tous les films d'une catégorie spécifique
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Liste des films de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '../models/category'
 *       500:
 *         description: Erreur serveur
 */
router.get('/:categoryId/movies', async (req, res) => {
    try {
        const movies = await Movie.find({ categories: req.params.categoryId });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
