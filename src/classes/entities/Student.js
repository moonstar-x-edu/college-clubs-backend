const Joi = require('joi');
const { v4: uuid } = require('uuid');
const Validator = require('./Validator');

class Student {
  constructor(validated) {
    for (const key in validated) {
      this[key] = validated[key];
    }

    this.id = uuid();
  }

  static from(obj, toCreate = true) {
    if (toCreate) {
      const validated = Validator.validate(obj, Student.SCHEMA.CREATE);
      return new Student(validated);
    }

    const validated = Validator.validate(obj, Student.SCHEMA.UPDATE);
    return new Student.Partial(validated);
  }
}

Student.SCHEMA = {
  CREATE: Joi.object({
    id: Joi.forbidden(),
    name: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    code: Joi.string().trim().length(6).required(),
    email: Joi.string().email().required(),
    semester: Joi.number().min(1).max(15).required(),
    career: Joi.string().trim().required(),
    birthday: Joi.string().isoDate().required(),
    joinedAt: Joi.string().isoDate().required()
  }),
  UPDATE: Joi.object({
    id: Joi.forbidden(),
    name: Joi.string().trim(),
    lastName: Joi.string().trim(),
    code: Joi.forbidden(),
    email: Joi.forbidden(),
    semester: Joi.number().min(1).max(15),
    career: Joi.string().trim(),
    birthday: Joi.forbidden(),
    joinedAt: Joi.forbidden()
  })
};

Student.Partial = class Partial {
  constructor(validated) {
    for (const key in validated) {
      this[key] = validated[key];
    }
  }
};

module.exports = Student;
