"use strict";

var redis = require('redis');
var when = require('when');

var parameters = require('../../config/parameters');
var Wredis = require('../../lib/redis/when-redis');

var port = parameters.redis.connection.port;
var host = parameters.redis.connection.host;
var options = parameters.redis.connection.options;

var client = redis.createClient(port, host, options);

var wclient = Wredis(client);

var ok = wclient.select(1);

ok = ok.then(function (res) {
	console.log(res);

	return wclient.flushdb();
});

ok.done(
	function (res) {
		console.log(res);
	},
	function (err) {
		console.error(err.stack || err);
	}
);