"use strict";

var request = require('superagent');
var when = require('when');

var parameters = require('../../config/parameters');
var RestError = require('../RestError');

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

					var code = +res.body.cod;
					var type = code / 100 | 0;

					if (res.clientError || (type === 4)) {
						return reject(new RestError('Error on query ' + query, (code > res.code) ? code : res.code));
					}

					if (res.serverError || (type === 5)) {
						return reject(new RestError('Error on query ' + query, (code > res.code) ? code : res.code));
					}

					resolve(res.body);
				});
		});
	}
};

parameters.apiStubs.names.forEach(function (name) {
	reqs[name] = function (query) {
		return when.promise(function (resolve, reject) {
			request
				.get('http://localhost:' + parameters.apiStubs.self[name].express.port + '/weather')
				.query({q : query})
				.end(function (err, res) {
					if (err) {
						return reject(err);
					}

					if (res.clientError) {
						return reject(new RestError('Error on query ' + query, res.code));
					}

					if (res.serverError) {
						return reject(new RestError('Error on query ' + query, res.code));
					}

					resolve(res.body);
				});
		});
	}
});

module.exports = reqs;