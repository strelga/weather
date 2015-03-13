"use strict";

var when = require('when');

/**
 * Promisify all the methods of the Redis client.
 * @param {Object} client Redis client object.
 * @return {Object}
 */
var Wredis = function (client) {
	var ret = {};

	for (var property in client) {
		if (typeof client[property] === 'function') {
			(function (method) {
				ret[method] = function () {
					var args = Array.prototype.slice.call(arguments);

					return when.promise(function (resolve, reject) {
						var cb = function (err, res) {
							if (err) {
								return reject(err);
							}

							resolve(res);
						};

						args.push(cb);
						
						client[method].apply(client, args);	
					});
				};

			})(property);
		}
	}

	return ret;
};

module.exports = Wredis;