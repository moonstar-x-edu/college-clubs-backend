const StudentDatabase = require('../src/classes/db/StudentDatabase');
const ClubDatabase = require('../src/classes/db/ClubDatabase');
const { clearDataSync } = require('./utils');
const { createStudents } = require('./initStudents');
const { createClubs } = require('./initClubs');
const { createMembers } = require('./initMembers');

clearDataSync();

const createEntities = async(studentsDB, clubsDB) => {
  await createStudents(studentsDB, 6);
  await createClubs(clubsDB, 2);

  const students = await studentsDB.getAll();
  const clubs = await clubsDB.getAll();
  
  await createMembers(clubsDB, students.slice(0, 3), clubs[0]);
  await createMembers(clubsDB, students.slice(3), clubs[1]);
};

const initialize = async() => {
  const studentsDB = new StudentDatabase();
  const clubsDB = new ClubDatabase();

  // Bad practice but the above constructors have an async method in them...
  setTimeout(() => {
    createEntities(studentsDB, clubsDB);
  }, 1000);
};

initialize();
