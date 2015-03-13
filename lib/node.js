"use strict";

var when = require('when');

var model = require('./redis/model');
var RestError = require('./RestError');
var parameters = require('../config/parameters');
var getterOfDataFromExternalApi = require('./apis/to_internal_data');

var requiredWeatherParameters = parameters.requiredWeatherParameters;
var apis = ['api1', 'api2', 'api3'];

exports.getWeather = function (query) {
	var ok = model.get_data_from_db_and_lock_if_not_locked();

	ok = ok.then(function (dataFromDb) {
		var ok = completeIfNeeded(dataFromDb);

		ok = ok.then(function (data) {
			if (data.changed && data.lock) {
				var okSet = model.set_data_to_db_and_release_lock(data);
				return okSet.finally(function () {
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

	var ok = when.map(apis, function (apiName) {
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