require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('@greencoast/logger');
const { logRequests, onlySupportedMethods, handleError } = require('./middleware');
const { ResourceNotFoundError } = require('./errors');
const Response = require('./classes/Response');

const HTTP_PORT = process.env.HTTP_PORT || 8080;

const app = express();
app.use(cors());
app.use(logRequests);

app.options('*', cors());

app.get('/', (req, res) => {
  const response = new Response(Response.CODES.OK);
  res.status(response.code).send(response.create('It works!'));
});

app.all('/', onlySupportedMethods(['GET']));

app.all('*', () => {
  throw new ResourceNotFoundError('This route is not handled by the server.');
});

app.use(handleError);

app.listen(HTTP_PORT, () => {
  logger.info(`API listening on ${HTTP_PORT}`);
});
