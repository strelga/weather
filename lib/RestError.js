"use strict";

var util = require('util');

var RestError = module.exports = function (message, code) {
	Error.captureStackTrace(this, this.constructor);
	
	if (typeof message === 'number') {
		code = message;
		message = '';
	}

	this.name = "RestError";
	this.message = message;
	this.code = code;
	this.type = code / 100 | 0;
};

util.inherits(RestError, Error);

module.exports = RestError;