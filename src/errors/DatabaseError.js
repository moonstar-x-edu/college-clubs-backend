const Response = require('../classes/Response');

class DatabaseError extends Error {
  constructor(message) {
    super(message);

    this.name = 'DatabaseError';
    this.statusCode = Response.CODES.INTERNAL_SERVER_ERROR;
  }
}

module.exports = DatabaseError;
