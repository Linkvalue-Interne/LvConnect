const HR = 'hr';
const BOARD = 'board';
const TECH = 'tech';
const BUSINESS = 'business';
const COMMUNICATION = 'com';
const FINANCE = 'finance';
const PROJECT_MANAGER = 'projectManager';

module.exports = {
  roles: {
    BOARD,
    HR,
    TECH,
    BUSINESS,
    COMMUNICATION,
    FINANCE,
    PROJECT_MANAGER,
  },
  cities: [
    'Lyon',
    'Lille',
    'Paris',
  ],
  permissions: {
    addUser: [HR, BOARD],
    editUser: [HR, BOARD],
    deleteUser: [HR, BOARD],
  },
};
