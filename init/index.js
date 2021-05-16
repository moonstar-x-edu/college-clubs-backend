const logger = require('@greencoast/logger');
const StudentDatabase = require('../src/classes/db/StudentDatabase');
const ClubDatabase = require('../src/classes/db/ClubDatabase');
const { clearDataSync } = require('./utils');
const { createStudents } = require('./initStudents');
const { createClubs } = require('./initClubs');
const { createMembers } = require('./initMembers');
const { createPosts } = require('./initPosts');

clearDataSync();

process.on('exit', () => {
  logger.info('Finished initializing databases.');
});

const createEntities = async(studentsDB, clubsDB) => {
  await createStudents(studentsDB, 6);
  await createClubs(clubsDB, 2);

  const students = await studentsDB.getAll();
  const clubs = await clubsDB.getAll();
  
  await createMembers(clubsDB, students.slice(0, 3), clubs[0]);
  await createMembers(clubsDB, students.slice(3), clubs[1]);

  const members0 = await clubsDB.membersManager.getAllClubMembers(clubs[0].id);
  const members1 = await clubsDB.membersManager.getAllClubMembers(clubs[1].id);

  await createPosts(clubsDB, members0, clubs[0], 5);
  await createPosts(clubsDB, members1, clubs[1], 5);

  process.exit(0);
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
