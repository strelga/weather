"use strict";

var runApiStubs = require('../../api_stub/run');

var ok = runApiStubs();

ok.done(
	function () {
		console.info('All servers are running.');
	},
	function (err) {
		console.error(err.stack || err);
	}
);