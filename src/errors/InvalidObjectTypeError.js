class InvalidObjectTypeError extends Error {
  constructor(message) {
    super(message);

    this.name = 'InvalidObjectTypeError';
  }
}

module.exports = InvalidObjectTypeError;
