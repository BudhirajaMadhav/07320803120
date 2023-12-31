const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const { numberRouter } = require('./src/routes');

app.get('/health-check', (req, res) => {
    res.status(200).send({ message: "Server is running" });
});
app.use('/numbers', numberRouter);

app.get('*', (req, res) => {
    res.status(404).send({ message: "Page not found" });
});

module.exports = app;