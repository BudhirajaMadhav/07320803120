const express = require('express');


const trainRouter = express.Router();

trainRouter.get('/', getNext12HourTrains);

module.exports = trainRouter;