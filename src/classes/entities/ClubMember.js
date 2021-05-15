const Joi = require('joi');
const { v4: uuid } = require('uuid');
const Validator = require('./Validator');

class ClubMember {
  constructor(validated) {
    for (const key in validated) {
      this[key] = validated[key];
    }

    this.id = uuid();
  }

  static from(obj, toCreate = true) {
    if (toCreate) {
      const validated = Validator.validate(obj, ClubMember.SCHEMA.CREATE);
      return new ClubMember(validated);
    }

    const validated = Validator.validate(obj, ClubMember.SCHEMA.UPDATE);
    return new ClubMember.Partial(validated);
  }
}

ClubMember.SCHEMA = {
  CREATE: Joi.object({
    id: Joi.forbidden(),
    nickname: Joi.string().trim(),
    imageURL: Joi.string().uri().allow(null).allow('').default(null),
    joinedAt: Joi.string().isoDate().required(),
    studentID: Joi.string().trim().required()
  }),
  UPDATE: Joi.object({
    id: Joi.forbidden(),
    nickname: Joi.string().trim(),
    imageURL: Joi.string().uri().allow(null).allow(''),
    joinedAt: Joi.forbidden(),
    studentID: Joi.forbidden()
  })
};

ClubMember.Partial = class Partial {
  constructor(validated) {
    for (const key in validated) {
      this[key] = validated[key];
    }
  }
};

module.exports = ClubMember;
