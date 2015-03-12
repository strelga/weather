"use strict";

var Random = require('random-js');

var parameters = require('../config/parameters');

var engine = Random.engines.nativeMath;

exports.getWeatherStub = function (query) {
	// Decide whether to return error or OK
	if (Random.bool(parameters.apiStubsErrors.errorProbability)(engine)) {
		if (Random.bool(parameters.apiStubsErrors.clientErrorProbability)(engine)) {
			throw new Error(400);
		} else {
			throw new Error(500);
		}
	}

	return {
		temp_c : Random.integer(-20, 20)(engine),
		relative_humidity : Random.integer(40, 70)(engine),
		pressure_mb : Random.real(1000, 1100, true)(engine)
	};
}