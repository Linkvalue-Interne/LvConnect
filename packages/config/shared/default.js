const HR = 'hr';
const BOARD = 'board';
const TECH = 'tech';
const LEAD = 'lead';
const BUSINESS = 'business';
const COMMUNICATION = 'com';
const FINANCE = 'finance';
const PROJECT_MANAGER = 'projectManager';
const TALENT = 'talent';
const FEEDBACK_MANAGER = 'feedbackManager';

module.exports = {
  roles: {
    BOARD,
    HR,
    TECH,
    LEAD,
    BUSINESS,
    COMMUNICATION,
    FINANCE,
    PROJECT_MANAGER,
    TALENT,
    FEEDBACK_MANAGER,
  },
  cities: [
    'Lyon',
    'Lille',
    'Paris',
  ],
  permissions: {
    addUser: [HR, TALENT, BOARD],
    editUser: [HR, TALENT, BOARD],
    deleteUser: [HR, TALENT, BOARD],
    addApp: [TECH, BOARD],
    editApp: [TECH, BOARD],
    deleteApp: [TECH, BOARD],
    addHook: [TECH, BOARD],
    editHook: [TECH, BOARD],
    deleteHook: [TECH, BOARD],
  },
  jobs: ['front', 'back', 'fullStack', 'designer', 'data', 'devOps', 'projectManager', 'mobile', 'marketing'],
  oauth: {
    scopes: [
      'users:get',
      'users:create',
      'users:delete',
      'users:modify',
      'profile:get',
      'profile:modify',
    ],
    privateScopes: [
      'apps:get',
      'apps:create',
      'apps:delete',
      'apps:modify',
      'hooks:get',
      'hooks:create',
      'hooks:delete',
      'hooks:modify',
    ],
  },
  hooks: {
    events: {
      userCreated: 'user:created',
      userModified: 'user:modified',
      userDeleted: 'user:deleted',
    },
    statuses: {
      success: 'success',
      failure: 'failure',
    },
  },
};
