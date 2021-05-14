const Joi = require('joi');
const { v4: uuid } = require('uuid');
const Validator = require('./Validator');

class Student {
  constructor() {
    this.id = uuid();
  }

  static from(obj, toCreate = true) {
    const validated = Validator.validate(obj, toCreate ? Student.SCHEMA.CREATE : Student.SCHEMA.UPDATE);

    return new Student(validated);
  }
}

Student.SCHEMA = {
  CREATE: Joi.object({
    id: Joi.forbidden()
  }),
  UPDATE: Joi.object({
    id: Joi.forbidden()
  })
};

module.exports = Student;
