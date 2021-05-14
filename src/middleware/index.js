/* eslint-disable max-params */
const logger = require('@greencoast/logger');
const onFinished = require('on-finished');
const { ResourceNotFoundError, InvalidBodyError } = require('../errors');
const Response = require('../classes/Response');

const onlySupportedMethods = (methods) => {
  return (_, res) => {
    res.header('Access-Control-Allow-Methods', `${methods.join(' ')} OPTIONS`);

    const response = new Response(Response.CODES.METHOD_NOT_ALLOWED);
    return res.status(response.code).send(response.create());
  };
};

const handleError = (error, req, res, next) => {
  let code = Response.CODES.INTERNAL_SERVER_ERROR;

  if (error instanceof ResourceNotFoundError) {
    code = Response.CODES.NOT_FOUND;
  }

  if (error instanceof InvalidBodyError) {
    code = Response.CODES.BAD_REQUEST;
  }

  const response = new Response(code);
  res.status(response.code).send(response.create(error));

  next();
};

const logRequests = (req, res, next) => {
  onFinished(res, (error, res) => {
    if (error) {
      logger.error(error);
      return;
    }

    logger.info(`${req.method}:${req.path} ${res.statusCode} (${req.ip})`);
  });

  next();
};

module.exports = {
  onlySupportedMethods,
  handleError,
  logRequests
};
