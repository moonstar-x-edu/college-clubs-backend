const StudentDatabase = require('./StudentDatabase');
const ClubDatabase = require('./ClubDatabase');

module.exports = {
  students: new StudentDatabase(),
  clubs: new ClubDatabase()
};
