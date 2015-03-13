"use strict";

var should = require('chai').should();
var sinon = require('sinon');
var when = require('when');

var node = require('../../lib/node');
var model = require('../../lib/redis/model');
var runApiStubs = require('../../api_stub/run');

describe.only('node', function () {
	before(function (done) {
		var ok = runApiStubs();

		ok = ok.then(function () {
			return model.flushdb();
		});

		ok.done(
			function () {
				done();
			},
			done
		);
	});

	describe('#getWeather', function () {
		it('should make queries to apis, return and update data in DB if there is no key in DB', function (done) {
			var get_data_stub = sinon.stub(model, "get_data_from_db_and_lock_if_not_locked", function () {
				return when({
					"city": "london",
					"lock": true,
					"weather": {
						"openweathermap": {},
						"api_stub_0": {},
						"api_stub_1": {}
					}
				});
			});

			var set_data_stub = 

			var ok = node.getWeather('london');

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