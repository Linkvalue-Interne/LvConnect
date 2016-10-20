module.exports = {
  method: 'GET',
  path: '/login',
  config: {
    auth: false,
  },
  handler: {
    view: {
      template: 'get-login',
      context: {
        title: 'Login',
      },
    },
  },
};
