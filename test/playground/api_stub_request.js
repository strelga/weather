"use strict";

var request = require('superagent');
var when = require('when');

var runApiStubs = require('../../api_stub/run');

var ok = runApiStubs();

ok = ok.then(function () {
	return when.promise(function (resolve, reject) {
		request
			.get('http://localhost:20200/weather')
			.end(function (err, res) {
				if (err) {
					console.log('client ' + res.clientError);
					console.log('server ' + res.serverError);

					return reject(err);
				}

				resolve(res.body);
			});
	});
});

ok = ok.then(function (result) {
	console.log(result);
});

ok.done(
	function () {
		console.info('Everything is OK.');
	},
	function (err) {
		console.error(err.stack || err);
	}
);