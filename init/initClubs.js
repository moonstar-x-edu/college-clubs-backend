const logger = require('@greencoast/logger');
const { Club } = require('../src/classes/entities');
const { randomArrayItem, executeSequentially } = require('./utils');

const names = [
  'Club #1',
  'Club #2',
  'Club #3'
];

const descriptions = [
  'Club Description',
  null
];

const imageURL = 'https://example.com/image.jpg';

const createdAt = new Date().toISOString();

const randomClub = () => {
  return {
    name: randomArrayItem(names),
    description: randomArrayItem(descriptions),
    imageURL,
    createdAt
  };
};

const createClubs = (db, number) => {
  const clubs = new Array(number).fill(null).map(() => Club.from(randomClub()));

  executeSequentially(clubs, (club) => {
    return db.create(club);
  }, (club) => {
    logger.info(`Created Club ${club.name}`);
  });
};

module.exports = {
  createClubs
};
