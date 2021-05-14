const InvalidStatusError = require('./InvalidStatusError');
const InvalidBodyError = require('./InvalidBodyError');
const InvalidObjectTypeError = require('./InvalidObjectTypeError');
const ResourceNotFoundError = require('./ResourceNotFoundError');
const ResourceAlreadyExistsError = require('./ResourceAlreadyExistsError');

module.exports = {
  InvalidStatusError,
  InvalidBodyError,
  InvalidObjectTypeError,
  ResourceNotFoundError,
  ResourceAlreadyExistsError
};
