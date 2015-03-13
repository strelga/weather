"use strict";

var model = require('../../lib/redis/model');

var ok = model.wclient.get('london:lock');

ok = ok.then(function (lock) {
	console.log(lock);
});

ok.done(
	function () {
		console.log("OK");
	},
	function (err) {
		console.error(err.stack || err);
	}
);