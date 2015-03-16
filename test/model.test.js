"use strict";

var should = require('chai').should();
var when = require('when');

var model = require('../lib/redis/model');

describe.only('redis.model', function () {
	var lock_key = 'london:lock';
	var city_key = 'london';

	beforeEach(function (done) {
		var ok = model.flushdb();

		ok.done(
			function () {
				done();
			},
			done
		)
	});

	describe('#get_data_from_db_and_lock_if_not_locked', function () {
		it('should acquire lock and return stub data object if there was no such key in Db', function (done) {
			var ok = model.get_data_from_db_and_lock_if_not_locked(city_key);

			ok = ok.then(function (dataFromDb) {
				return model.wclient.get(lock_key).then(function (lock) {
					lock.should.be.ok;

					dataFromDb.lock.should.be.true;
					dataFromDb.weather.should.be.an('object');
				});
			});

			ok.done(
				function () {
					done();
				},
				done
			);
		});

		it('should only return data if lock is already acquired', function (done) {
			var weather = {
		        openweathermap : {temp : 10},
		        api_stub_0 : {},
		        api_stub_1 : {}
			};

			var okCity = model.wclient.set(city_key, JSON.stringify(weather));
			var okLock = model.wclient.set(lock_key, JSON.stringify(weather));

			var ok = when.join(okCity, okLock);

			ok = ok.then(function () {
				return model.get_data_from_db_and_lock_if_not_locked(city_key);
			});

			ok = ok.then(function (dataFromDb) {
				return model.wclient.get(lock_key).then(function (lock) {
					lock.should.be.ok;

					dataFromDb.lock.should.be.false;
					dataFromDb.weather.openweathermap.temp.should.be.equal(10);
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

	describe('#set_data_to_db_and_release_lock', function () {
		it('should set data and release lock if it is acquired', function (done) {
			var ok = model.get_data_from_db_and_lock_if_not_locked(city_key);

			ok = ok.then(function (data) {
				data.weather = {
					"openweathermap": {},
					"api_stub_0": {
						"temp": -3,
						"humidity": 49,
						"pressure": 1090.23336663443
					},
					"api_stub_1": {
						"temp": -20,
						"humidity": 49,
						"pressure": 1097.9057796640632
					}
				};
				data.changed = true;

				return model.set_data_to_db_and_release_lock(data);
			});

			ok = ok.then(function () {
				return model.wclient.get(city_key).then(function (weather) {
					weather = JSON.parse(weather);

					weather.api_stub_0.temp.should.be.equal(-3);
				});
			});

			ok = ok.then(function () {
				return model.wclient.get(lock_key).then(function (lock) {
					(lock === null).should.be.true;
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

	describe('#release_lock', function () {
		it('should release the lock if it is acquired', function (done) {
			var ok = model.get_data_from_db_and_lock_if_not_locked(city_key);

			ok = ok.then(function (dataFromDb) {
				return model.wclient.get(lock_key).then(function (lock) {
					lock.should.be.ok;
					return dataFromDb;
				});
			});

			ok = ok.then(function (dataFromDb) {
				return model.release_lock(dataFromDb.city);
			});

			ok = ok.then(function () {
				return model.wclient.get(lock_key).then(function (lock) {
					(lock === null).should.be.true;
				})
			});

			ok.done(
				function () {
					done();
				},
				done
			);
		});
	})
});