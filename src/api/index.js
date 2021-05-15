const express = require('express');
const studentRouter = require('./studentRouter');
const clubRouter = require('./clubRouter');

const api = express.Router();

api.use('/', studentRouter);
api.use('/', clubRouter);

module.exports = api;
