"use strict";

var should = require('chai').should();
var request = require('superagent');
var when = require('when');

var parameters = require('../../config/parameters');
var runApiStubs = require('../../api_stub/run');

var NUM_ITER = 100;

describe('api_stub_run', function () {
	it('should show the right distribution of successful and failed requests for each of the spawned servers', function (done) {
		var stats = {};

		var ok = runApiStubs();

		ok = ok.then(function () {
			return when.map(parameters.apiStubs.names, function (name) {
				stats[name] = {
					success : 0,
					clientError : 0,
					serverError : 0,
					internalError : 0
				};

				var ok = when();

				for (var i = 0; i < NUM_ITER; i++) {
					ok = ok.then(function () {
						return when.promise(function (resolve, reject) {
							request
								.get('http://localhost:' + parameters.apiStubs.self[name].express.port + '/weather')
								.query({q : 'London,uk'})
								.end(function (err, res) {
									if (err) {
										stats[name].internalError++;
										return resolve();
									}

									if (res.clientError) {
										stats[name].clientError++;
										return resolve();
									}

									if (res.serverError) {
										stats[name].serverError++;
										return resolve();
									}

									stats[name].success++;
									return resolve();
								});	
						});
					});
				}

				return ok.then(function () {
					for (var key in stats[name]) {
						stats[name][key] /= NUM_ITER;
					}

					console.log(name);
					console.log(stats[name]);

					stats[name].internalError.should.be.at.least(0);
					stats[name].success.should.be.above(0.9 - parameters.apiStubs.errors.errorProbability);
				});
			});
		});

		ok.done(
			function () {
				done();
			},
			done
		);
	});
});