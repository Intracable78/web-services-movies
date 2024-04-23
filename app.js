const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const movieRoutes = require('./routes/movies');
const categoryRoutes = require('./routes/categories');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('./database');

app.use(bodyParser.json());

app.use('/movies', movieRoutes);
app.use('/categories', categoryRoutes);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de gestion de films',
            version: '1.0.0',
            description: 'Une API simple pour gérer une collection de films',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => {
    console.log('Server is On at http://localhost/3000')
})