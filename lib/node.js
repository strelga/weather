"use strict";

var when = require('when');

var logger = require('../logger');
var model = require('./redis/model');
var RestError = require('./RestError');
var parameters = require('../config/parameters');
var getterOfDataFromExternalApi = require('./apis/to_internal_data');

var requiredWeatherParameters = parameters.requiredWeatherParameters;

/**
 * Tries to acquire a custom lock in Redis. Under the hood - 
 * to set the string field with key <city>:lock. If the lock
 * is acquired, the script will assess the weather data from
 * Redis, try to complete it if it is incomplete and 
 * update it in Redis. The lock is released either after 
 * examining the data or, if the script fails, by a timeout.
 * 
 * @param  {String} query Practically it contains the name of the city
 * @return {Promise} 
 */
exports.getWeather = function (query) {
	var ok = model.get_data_from_db_and_lock_if_not_locked(query);

	ok = ok.then(function (dataFromDb) {
		var ok = completeIfNeeded(dataFromDb);

		ok = ok.then(function (data) {
			if (data.changed && data.lock) {
				var okSet = model.set_data_to_db_and_release_lock(data);
				okSet = okSet.otherwise(function (err) {
					logger.error({err:err}, 'An error while setting the data and releasing the lock.');
				});
				return okSet.then(function () {
					return data;
				});
			}
			if (data.lock) {
				var okRelease = model.release_lock(data);
				okRelease = okRelease.otherwise(function (err) {
					logger.error({err:err}, 'An error while releasing the lock.');
				});
				return okRelease.then(function () {
					return data;
				});
			}

			return data;
		});

		return ok;
	});

	return ok.then(function (data) {
		return data.weather;
	});
};

function completeIfNeeded (dataFromDb) {
	var data = JSON.parse(JSON.stringify(dataFromDb));

	var ok = when.map(parameters.usedApis, function (apiName) {
		if (typeof data.weather[apiName] !== 'object') {
			return;
		}

		if (typeof data.weather[apiName][requiredWeatherParameters[0]] === 'undefined') {
			var ok = getterOfDataFromExternalApi[apiName](data.city);

			return ok.then(
				function (weather) {
					data.weather[apiName] = weather;
					data.changed = true;
				},
				function (err) {
					if (err.type === 4) {
						delete data.weather[apiName];
						data.changed = true;
					}
				}
			);
		}
	});

	return ok.then(function () {
		return data;
	});
}