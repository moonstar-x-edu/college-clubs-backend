const logger = require('@greencoast/logger');
const { ClubMember } = require('../src/classes/entities');
const { randomArrayItem, executeSequentially } = require('./utils');

const nicknames = [
  'Member',
  null
];

const imageURL = 'https://example.com/image.jpg';

const joinedAt = new Date().toISOString();

const randomMember = (studentID) => {
  return {
    nickname: randomArrayItem(nicknames),
    imageURL,
    joinedAt,
    studentID,
    role: randomArrayItem(ClubMember.ROLES)
  };
};

const createMembers = (db, students, club) => {
  const studentIDs = students.map((s) => s.id);
  const members = new Array(students.length).fill(null).map((_, idx) => ClubMember.from(randomMember(studentIDs[idx])));

  return executeSequentially(members, (member) => {
    return db.membersManager.createClubMember(club.id, member);
  }, (member) => {
    logger.info(`Created Member ${member.id} in Club ${club.name}`);
  });
};

module.exports = {
  createMembers
};
