const express = require('express');

const { getAllNumbers } = require('../controllers');

const numberRouter = express.Router();

numberRouter.get('/', getAllNumbers);

module.exports = numberRouter;