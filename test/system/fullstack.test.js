"use strict";

var request = require('supertest');
var when = require('when');

var okApp = require('../../index');

describe.only('index', function () {
	var app;

	before(function (done) {
		var ok = okApp.then(function (_app) {
			app = _app;
		});

		ok.done(
			function () {
				done();
			},
			done
		);
	});

	describe('/weather', function () {
		it('should return the more and more complete data', function (done) {
			var ok = when.promise(function (resolve, reject) {
				request(app)
					.get('/weather')
					.query({q : 'london'})
					.end(function (err, res) {
						if (err) {
							return reject(err);
						}

						resolve(res.body)
					});
			});

			ok = ok.then(function (weather) {
				console.log(weather);
			});

			ok.done(
				function () {
					done();
				},
				done
			);
		});
	});
});