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

parameters.apiStubsExpress = {};

for (var i = 0; i < parameters.apiStubsNumber; i++) {
	parameters.apiStubsExpress['api_stub_' + i] = {
		host : '0.0.0.0',
		port : 20200 + i
	};
}

module.exports = parameters;