const Joi = require('joi');
const { v4: uuid } = require('uuid');
const Validator = require('./Validator');

class Club {
  constructor(validated) {
    for (const key in validated) {
      this[key] = validated[key];
    }

    this.id = uuid();
  }

  static from(obj, toCreate = true) {
    if (toCreate) {
      const validated = Validator.validate(obj, Club.SCHEMA.CREATE);
      return new Club(validated);
    }

    const validated = Validator.validate(obj, Club.SCHEMA.UPDATE);
    return new Club.Partial(validated);
  }
}

Club.SCHEMA = {
  CREATE: Joi.object({
    id: Joi.forbidden(),
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow(null).allow('').default(null),
    imageURL: Joi.string().uri().allow(null).allow('').default(null),
    createdAt: Joi.string().isoDate().required()
  }),
  UPDATE: Joi.object({
    id: Joi.forbidden(),
    name: Joi.string().trim(),
    description: Joi.string().trim().allow(null).allow(''),
    imageURL: Joi.string().uri().allow(null).allow(''),
    createdAt: Joi.forbidden()
  })
};

Club.Partial = class Partial {
  constructor(validated) {
    for (const key in validated) {
      this[key] = validated[key];
    }
  }
};

module.exports = Club;
