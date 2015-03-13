"use strict";

var fs = require('fs');
var path = require('path');

var redis = require('redis');
var when = require('when');

var parameters = require('../../config/parameters');
var Wredis = require('./when-redis');


var port = parameters.redis.connection.port;
var host = parameters.redis.connection.host;
var options = parameters.redis.connection.options;

var client = redis.createClient(port, host, options);

var wredis = Wredis(client);

var get_data_script = fs.readFileSync(path.join(__dirname, './lua/get_data_from_db_and_lock_if_not_locked.lua'), {encoding : 'utf8'});
var set_data_script = fs.readFileSync(path.join(__dirname, './lua/set_data_to_db_and_release_lock.lua'), {encoding : 'utf8'});



/**
 * Tries to acquire a lock on a weather for particular city (the key) and gets data.
 * @param  {String} city
 * @return {Promise}
 */
exports.get_data_from_db_and_lock_if_not_locked = function (city) {
	var ok = wredis.eval(get_data_script, 2, city + ':lock', city, parameters.redis.timeouts.lock);

	ok = ok.then(function (res) {
		var dataFromDb = {};

		dataFromDb.city = city;
		dataFromDb.lock = (res[0] === 'OK') ? true : false;
		dataFromDb.weather = getWeather(res[2]);

		return dataFromDb;
	});

	return ok;
};

/**
 * Sets the updated data and releases the lock.
 * @param {Object} data 	Object containing weather,
 *                       	city and information about the lock.
 * @return {Promise}
 */
exports.set_data_to_db_and_release_lock = function (data) {
	var weather = JSON.stringify(data.weather);

	var ok = wredis.eval(set_data_script, 2, data.city, data.city + ':lock', weather, parameters.redis.timeouts.weather);

	ok = ok.then(function (res) {

	});

	return ok;
};

/**
 * Just releases the lock.
 * @param  {Object} data 
 * @return {Promise}
 */
exports.release_lock = function (data) {
	var ok = wredis.del(data.city + ':lock');

	return ok.then(function (res) {

	});
};

function getWeather (fromDb) {
	if (fromDb === null) {
		var weather = {};

		parameters.usedApis.forEach(function (apiName) {
			weather[apiName] = {};
		});

		return weather;
	}

	return JSON.parse(fromDb);
}
