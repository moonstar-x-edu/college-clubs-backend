const StudentDatabase = require('../src/classes/db/StudentDatabase');
const ClubDatabase = require('../src/classes/db/ClubDatabase');
const { clearDataSync } = require('./utils');
const { createStudents } = require('./initStudents');
const { createClubs } = require('./initClubs');

clearDataSync();

const createEntities = async(studentsDB, clubsDB) => {
  await createStudents(studentsDB, 6);
  await createClubs(clubsDB, 2);
};

const initialize = async() => {
  const studentsDB = new StudentDatabase();
  const clubsDB = new ClubDatabase();

  setTimeout(() => {
    createEntities(studentsDB, clubsDB);
  }, 1000);
};

initialize();
