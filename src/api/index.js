const express = require('express');
const studentRouter = require('./studentRouter');

const api = express.Router();

api.use('/', studentRouter);

module.exports = api;
