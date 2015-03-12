"use strict";

var requiredParameters = [
	'temp',
	'humidity'
];

var adapters = {
	'openweathermap' : {
		temp : function (obj) {
			return obj.main.temp;
		},
		humidity : function (obj) {
			return obj.main.humidity;
		}
	}
};

for (var api in adapters) {
	requiredParameters.forEach(function (parameter) {
		if (typeof adapters[api][parameter] === 'undefined') {
			throw new Error('There is no the required parameter "' + parameter + '" in ' + api + ' adapter.');
		}
	});
}

module.exports = adapters;