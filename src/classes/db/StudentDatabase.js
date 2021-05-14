const SQLiteDatabase = require('./SQLiteDatabase');
const { ResourceAlreadyExistsError, ResourceNotFoundError, InvalidObjectTypeError } = require('../../errors');
const { Student } = require('../entities');

class StudentDatabase extends SQLiteDatabase {
  constructor() {
    super('students.sqlite', 'DB:Students');

    this.students = this._createStore('students');
    this._prepareKeys(this.students);
  }

  async create(student) {
    if (student instanceof Student) {
      throw new InvalidObjectTypeError('New student needs to be of instance Student.');
    }

    const entry = await this.students.get(student.id);
    
    if (entry) {
      throw new ResourceAlreadyExistsError(`Student ${student.id} already exists.`);
    }

    await this.students.set(student.id, student);

    const keys = await this.getKeys(this.students);
    await this.setKeys(this.students, [...keys, student.id]);

    return student;
  }

  async get(id) {
    const entry = await this.students.get(id);

    if (!entry) {
      throw new ResourceNotFoundError(`Student ${id} does not exist!`);
    }

    return entry;
  }

  async getAll() {
    const keys = await this.getKeys(this.students);

    return Promise.all(keys.map((key) => this.get(key)));
  }

  async delete(id) {
    const old = await this.get(id);
    await this.students.delete(id);

    const keys = await this.getKeys(this.students);
    await this.setKeys(this.students, keys.filter((key) => key !== id));

    return old;
  }

  async update(id, newStudent) {
    const old = await this.get(id);
    const merged = { ...old, ...newStudent };

    await this.students.set(id, merged);

    return merged;
  }
}

module.exports = StudentDatabase;
