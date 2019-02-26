const Joi = require('joi');
const { hasScopeInList } = require('../../middlewares');
const diacritics = require('diacritics');

const replacementMap = new Map(diacritics.replacementList.map(({ base, chars }) => [base, chars]));

module.exports = {
  method: 'GET',
  path: '/users',
  config: {
    pre: [hasScopeInList(['users:get'])],
    validate: {
      query: Joi.object().keys({
        email: Joi.string().max(50),
        ids: Joi.array().items(Joi.string()).single(),
        search: Joi.string().max(50),
        limit: Joi.number().min(1).max(100),
        page: Joi.number().min(1),
      }),
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const limit = req.query.limit || 20;
    const page = req.query.page - 1 || 0;
    const { email, search, ids } = req.query;

    function applyFilters(query) {
      if (ids) {
        query.where({ _id: { $in: ids } });
        return query;
      }
      if (email) {
        query.where({ email: { $eq: email } });
      }
      if (search) {
        const searchRegexp = new RegExp(
          diacritics.remove(search)
            .trim()
            .replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&')
            .replace(/\w/g, match => `[${match}${replacementMap.get(match)}]`)
            .split(/\s/g)
            .filter(s => s)
            .join('|'),
          'ig',
        );
        query.or([{ firstName: { $regex: searchRegexp } }, { lastName: { $regex: searchRegexp } }]);
      }
      return query;
    }

    const userQuery = applyFilters(User.find());

    const resultPromise = userQuery
      .limit(limit)
      .skip(page * limit || 0)
      .select('-password -thirdParty -needPasswordChange')
      .sort('lastName firstName createdAt')
      .exec();

    const countPromise = applyFilters(User.countDocuments());

    const usersPromise = Promise.all([resultPromise, countPromise])
      .then(([results, count]) => ({
        results,
        pageCount: Math.ceil(count / limit),
        page: page + 1,
        limit,
      }));

    return res.mongodb(usersPromise);
  },
};
