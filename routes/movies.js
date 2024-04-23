const express = require('express');
const Movie = require('../models/movie');
const router = express.Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Recherche et récupère des films basés sur les critères de titre ou description
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Titre partiel ou complet pour la recherche des films
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Description partielle ou complète pour la recherche des films
 *     responses:
 *       200:
 *         description: Liste des films trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 */

router.get('/', async (req, res) => {
    const { title, description, page = 1, limit = 10 } = req.query;
    let query = {};
    if (title) {
        query.name = { $regex: title, $options: 'i' };
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

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Récupère un film par son ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film à récupérer
 *     responses:
 *       200:
 *         description: Retourne le film demandé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Film non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('Movie not found');
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Crée un nouveau film
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Le film a été créé avec succès
 *       400:
 *         description: Requête invalide
 */

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

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Met à jour un film spécifié par ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du film à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Le film a été mis à jour avec succès
 *       422:
 *         description: Validation des données impossible
 */

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
/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Supprime un film spécifié par son ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du film à supprimer
 *     responses:
 *       200:
 *         description: Le film a été supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Deleted Movie'
 *       404:
 *         description: Film non trouvé
 *       500:
 *         description: Erreur serveur
 */

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