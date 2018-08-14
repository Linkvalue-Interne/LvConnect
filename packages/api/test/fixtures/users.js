const roles = require('../../src/roles');

module.exports = [{
  firstName: 'Foo',
  lastName: 'Boo',
  email: 'foo@bar.com',
  password: '$2a$10$lNbtFeWS1GuquR50WIzWTekc9UychxS7vzkQAy/G8liWQSwRKsNSW', // password
  roles: Object.values(roles),
  profilePictureUrl: 'http://foo.bar',
  createdAt: new Date(),
  city: 'Paris',
  needPasswordChange: false,
}, {
  firstName: 'Baz',
  lastName: 'Qux',
  email: 'baz@qux.com',
  password: '$2a$10$lNbtFeWS1GuquR50WIzWTekc9UychxS7vzkQAy/G8liWQSwRKsNSW', // password
  roles: [roles.TECH],
  createdAt: new Date(),
  city: 'Lyon',
  needPasswordChange: false,
}];
