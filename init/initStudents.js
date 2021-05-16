const logger = require('@greencoast/logger');
const { Student } = require('../src/classes/entities');
const { randomArrayItem, executeSequentially } = require('./utils');

const names = [
  'Christian',
  'Jose Luis',
  'Rai'
];

const lastNames = [
  'Lopez',
  'Contreras',
  'Diaz'
];

const randomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const email = 'email@example.com';

const randomSemester = () => {
  return Math.floor(Math.random() * 10) + 1;
};

const career = 'Computer Science';

const birthday = new Date().toISOString();

const joinedAt = new Date().toISOString();

const randomStudent = () => {
  return {
    name: randomArrayItem(names),
    lastName: randomArrayItem(lastNames),
    code: `${randomCode()}`,
    email,
    semester: randomSemester(),
    career,
    birthday,
    joinedAt
  };
};

const createStudents = (db, number) => {
  const students = new Array(number).fill(null).map(() => Student.from(randomStudent()));

  return executeSequentially(students, (student) => {
    return db.create(student);
  }, (student) => {
    logger.info(`Created Student ${student.name}`);
  });
};

module.exports = {
  createStudents
};
