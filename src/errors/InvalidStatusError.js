class InvalidStatusError extends Error {
  constructor(message) {
    super(message);

    this.name = 'InvalidStatusError';
  }
}

module.exports = InvalidStatusError;
