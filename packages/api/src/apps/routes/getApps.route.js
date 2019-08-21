const Joi = require('@hapi/joi');
const diacritics = require('diacritics');

const { hasScopeInList } = require('../../middlewares');

const replacementMap = new Map(diacritics.replacementList.map(({ base, chars }) => [base, chars]));

module.exports = {
  method: 'GET',
  path: '/apps',
  config: {
    pre: [hasScopeInList(['apps:get'])],
    validate: {
      query: Joi.object().keys({
        name: Joi.string().max(50),
        search: Joi.string().max(50),
        limit: Joi.number().min(1).max(100),
        page: Joi.number().min(1),
      }),
    },
  },
  handler(req, res) {
    const { Application } = req.server.plugins.apps.models;
    const limit = req.query.limit || 20;
    const page = req.query.page - 1 || 0;
    const { search, name } = req.query;

    function applyFilters(query) {
      if (name) {
        query.where({ name: { $eq: name } });
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
        query.where({ name: { $regex: searchRegexp } });
      }
      return query;
    }

    const appQuery = applyFilters(Application.find());

    const resultPromise = appQuery
      .limit(limit)
      .skip(page * limit || 0)
      .select('-appId -appSecret')
      .sort('name')
      .populate({ path: 'user', select: ['firstName', 'lastName'] })
      .exec();

    const countPromise = applyFilters(Application.countDocuments());

    const appsPromise = Promise.all([resultPromise, countPromise])
      .then(([results, count]) => ({
        results,
        pageCount: Math.ceil(count / limit),
        page: page + 1,
        limit,
      }));

    return res.mongodb(appsPromise);
  },
};
