"use strict";

var when = require('when');

var methods = [
	'eval',
	'del'
];

var Wredis = function (client) {
	var ret = {};

	methods.forEach(function (method) {
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
	});

	return ret;
};

module.exports = Wredis;