"use strict";

var should = require('chai').should();
var request = require('supertest');
var when = require('when');

var parameters = require('../../config/parameters');
var app = require('../../api_stub/index');

var NUM_ITER = 500;

describe('api_stub_index', function () {
	it('should show the right distribution of successful and failed requests', function (done) {
		var stats = {
			success : 0,
			clientError : 0,
			serverError : 0,
			internalError : 0
		};

		var ok = when();

		for (var i = 0; i < NUM_ITER; i++) {
			ok = ok.then(function () {
				return when.promise(function (resolve, reject) {
					request(app)
						.get('/weather')
						.query({q : 'London,uk'})
						.end(function (err, res) {
							if (err) {
								stats.internalError++;
								return resolve();
							}

							if (res.clientError) {
								stats.clientError++;
								return resolve();
							}
							
							if (res.serverError) {
								stats.serverError++;
								return resolve();
							}

							stats.success++;
							return resolve();
						});	
				});
			});
		}

		ok = ok.then(function () {
			for (var key in stats) {
				stats[key] /= NUM_ITER;
			}

			console.log(stats);

			stats.internalError.should.be.at.least(0);
			stats.success.should.be.above(0.9 - parameters.apiStubs.errors.errorProbability);
		});

		ok.done(
			function () {
				done();
			},
			done
		);
	});
});