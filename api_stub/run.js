"use strict";

var fork = require('child_process').fork;
var path = require('path');

var when = require('when');

var parameters = require('../config/parameters');

/**
 * Spawn api stubs servers and wait till they start listening.
 * @return {Promise} When it resolves, all the servers are listening.
 */
module.exports = function () {
	return when.map(parameters.apiStubs.names, function (name) {
		return when.promise(function (resolve, reject) {
			var file = path.join(__dirname, 'index.js');
			var options = {
				env : {
					NODE_ENV		: process.env.NODE_ENV,
					EXPRESS_HOST	: parameters.apiStubs.self[name].express.host,
					EXPRESS_PORT	: parameters.apiStubs.self[name].express.port,
					FORK			: 1
				},
				silent : true
			}

			var child = fork(file, options);

			var timeoutId = setTimeout(function () {
				reject(new Error('Timeout exceeded on process spawning.'));
			}, parameters.apiStubs.spawnTimeout);

			child.on('message', function (msg) {
				if (msg.listening === true) {
					clearTimeout(timeoutId);
					return resolve();
				}
			});

			child.on('error', function (err) {
				reject(err);
			});
		});
	});
};