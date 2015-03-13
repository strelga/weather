"use strict";

var parameters = {};

parameters.express = {
	host : '0.0.0.0',
	port : 20100
};

parameters.redis = {
	connection : {
		host : '127.0.0.1',
		port : 6379,
		options : {}
	},
	timeouts : {
		lock : 2,
		weather : 3600
	}
};

parameters.apiStubs = {};

parameters.apiStubs.errors = {
	errorProbability : 0.1,
	clientErrorProbability : 0.5
};

parameters.apiStubs.spawnTimeout = 3000;

parameters.apiStubs.number = 2;

parameters.apiStubs.names = [];
for (var i = 0; i < parameters.apiStubs.number; i++) {
	parameters.apiStubs.names[i] = 'api_stub_' + i;
}

// Individual parameters for each stub
parameters.apiStubs.self = {};
parameters.apiStubs.names.forEach(function (name, i) {
	parameters.apiStubs.self[name] = {
		express : {
			host : '0.0.0.0',
			port : 20200 + i
		}
	};
});

parameters.requiredWeatherParameters = [
	'temp',		// deegrees Celsium
	'humidity',	// percentage
	'pressure'	// mbar
];

parameters.usedApis = [
	'openweathermap'
];
parameters.apiStubs.names.forEach(function (name) {
	parameters.usedApis.push(name);
});

module.exports = parameters;