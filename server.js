// Setup an Express app
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// routes:
const add = require('./routes/api/add');
const get = require('./routes/api/get');
const findSimilarFace = require('./routes/api/findSimilarFace');
const remove = require('./routes/api/remove');
app.use('/add', add);
app.use('/get', get);
app.use('/find', findSimilarFace);
app.use('/delete', remove);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
