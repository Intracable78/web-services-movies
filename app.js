const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const movieRoutes = require('./routes/movies');
require('./database');

app.use(bodyParser.json());

app.use('/movies', movieRoutes);

app.listen(3000, () => {
    console.log('Server is On at http://localhost/3000')
})