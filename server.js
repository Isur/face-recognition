// Setup an Express app
const express = require('express');
const bodyParser = require('body-parser');

const API_KEY = require('./config/keys').api_key;
const API_REGION = require('./config/keys').api_region;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// routes:
const add = require('./routes/api/add');
const getFace = require('./routes/api/getFace');
const findSimilarFace = require('./routes/api/findSimilarFace');
app.use('/add', add);  
app.use('/get', getFace);
app.use('/find', findSimilarFace);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;