var libdir = process.env.CONNECT_RENDER_COV ? './lib-cov' : './lib';
module.exports = require(libdir + '/render');
module.exports.filters = require(libdir + '/filters');