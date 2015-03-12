"use strict";

var parameters = require('../../config/parameters');

var requiredParameters = [
	'temp',		// deegrees Celsium
	'humidity',	// percentage
	'pressure'	// mbar
];

var adapters = {
	'openweathermap' : {
		temp : function (obj) {
			return obj.main.temp;
		},
		humidity : function (obj) {
			return obj.main.humidity;
		},
		pressure : function (obj) {
			return obj.main.pressure;
		}
	}
};

// Add adapters for all the api stubs. All the adapters are the same,
// since all the api stubs are the same.
parameters.apiStubsNames.forEach(function (name) {
	adapters[name] = {
		temp : function (obj) {
			return obj.temp_c;
		},
		humidity : function (obj) {
			var res = obj.relative_humidity.match(/^(\d{1,3})\%$/);

			if (res === null) {
				throw new Error('Humidity is passed in the wrong format. Should be a string containing a number of percents and a \% sign. Given: ' + obj.relative_humidity);
			}

			return +res[1];
		},
		pressure : function (obj) {
			return obj.pressure_mb;
		}
	};
});

// Check if all the required parameters are apresent in the adaptor.
for (var api in adapters) {
	requiredParameters.forEach(function (parameter) {
		if (typeof adapters[api][parameter] === 'undefined') {
			throw new Error('There is no the required parameter "' + parameter + '" in ' + api + ' adapter.');
		}
	});
}

module.exports = adapters;