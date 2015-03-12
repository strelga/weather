/**
 * The putting it all together file.
 */

"use srtict";

var createTransforms = require('./create_api_transforms');
var adapters = require('./adapters');
var requests = require('./requests');

/**
 * Returns a hash of functions making the full stack set
 * of operations to get the weather in internal format
 * from the external APIs.
 * @return {Object}		key - API name
 *                      value - function taking a query
 *                      	and returning the weather
 *                      	corresponding to the query in
 *                      	the internal format.
 */
function getApiToInternalDataTransforms () {
	var transforms = createTransforms(adapters);

	var result = {};

	for (var api in adapters) {
		(function (api) {
			result[api] = function (query) {
				var ok = requests[api](query);

				ok = ok.then(function (data) {
					return transforms[api](data);
				});

				return ok;
			};
		})(api);
	}

	return result;
}

module.exports = getApiToInternalDataTransforms();