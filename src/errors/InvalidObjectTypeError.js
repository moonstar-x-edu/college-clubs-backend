const Response = require('../classes/Response');

class InvalidObjectTypeError extends Error {
  constructor(message) {
    super(message);

    this.name = 'InvalidObjectTypeError';
    this.statusCode = Response.CODES.INTERNAL_SERVER_ERROR;
  }
}

module.exports = InvalidObjectTypeError;
