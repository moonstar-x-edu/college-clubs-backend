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

  toString() {
    return JSON.stringify(this.data);
  }

  static from(obj, toCreate = true) {
    const validated = Validator.validate(obj, toCreate ? Student.SCHEMA.CREATE : Student.SCHEMA.UPDATE);

    return new Student(validated);
  }
}

Student.SCHEMA = {
  CREATE: Joi.object({
    id: Joi.forbidden(),
    name: Joi.string().trim().required()
  }),
  UPDATE: Joi.object({
    id: Joi.forbidden()
  })
};

module.exports = Student;
