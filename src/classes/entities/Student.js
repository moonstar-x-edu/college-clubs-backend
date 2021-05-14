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
    lastName: Joi.string().trim().required()
  }),
  UPDATE: Joi.object({
    id: Joi.forbidden(),
    name: Joi.string().trim(),
    lastName: Joi.string().trim()
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
