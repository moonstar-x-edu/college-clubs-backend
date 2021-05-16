const StudentDatabase = require('../src/classes/db/StudentDatabase');
const { clearDataSync } = require('./utils');
const { createStudents } = require('./initStudents');

clearDataSync();

const initialize = async() => {
  const studentsDB = new StudentDatabase();

  setTimeout(async() => {
    createStudents(studentsDB, 5);
  }, 1000);
};

initialize();
