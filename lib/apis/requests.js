"use strict";

var request = require('superagent');
var when = require('when');

var reqs = {
	'openweathermap' : function (query) {
		return when.promise(function (resolve, reject) {
			request
				.get('http://api.openweathermap.org/data/2.5/weather')
				.query({q : query})
				.query({units : 'metric'})
				.end(function (err, res) {
					if (err) {
						return reject(err);
					}

					if (res.error) {
						return reject(new Error('Server responded with ' + res.status + ' for query ' + query));
					}

					if (+res.body.cod >= 400) {
						return reject(new Error('Server responded with ' + res.body.cod  + ': ' + res.body.message));
					}

					resolve(res.body);
				});
		});
	}
};

module.exports = reqs;