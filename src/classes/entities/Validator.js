const { InvalidBodyError } = require('../../errors');

class Validator {
  static validate(obj, Schema) {
    const { error: validationError, value: validatedData } = Schema.validate(obj, { convert: false });

    if (validationError) {
      throw new InvalidBodyError(validationError);
    }

    return validatedData;
  }
}

module.exports = Validator;
