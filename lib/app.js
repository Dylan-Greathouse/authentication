const express = require('express');

const app = express();

app.use(express.json());
//cookie needs to be added
app.use('/auth/signup');

app.use(require('./middleware/not-found.js'));
app.use(require('./middleware/error.js'));

module.exports = app;
