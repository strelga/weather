"use strict";

var parameters = {};

parameters.express = {
	host : '0.0.0.0',
	port : 20100
};

parameters.apiStubsErrors = {
	errorProbability : 0.1,
	clientErrorProbability : 0.5
};

parameters.apiStubsNumber = 1;

parameters.apiStubsNames = [];
for (var i = 0; i < parameters.apiStubsNumber; i++) {
	parameters.apiStubsNames[i] = 'api_stub_' + i;
}

parameters.apiStubsExpress = {};
parameters.apiStubsNames.forEach(function (name) {
	parameters.apiStubsExpress[name] = {
		host : '0.0.0.0',
		port : 20200 + i
	};
});

module.exports = parameters;