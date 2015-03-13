"use strict";

var redis = require('redis');

var should = require('chai').should();

var Wredis = require('../lib/redis/when-redis');
var parameters = require('../config/parameters');

describe('when-redis', function () {
	var port = parameters.redis.connection.port;
	var host = parameters.redis.connection.host;
	var options = parameters.redis.connection.options;

	var client = redis.createClient(port, host, options);

	var wredis = Wredis(client);

	describe('#eval', function () {
		it('should return proper result', function (done) {
			var ok = wredis.eval('return 10', 0);

			ok = ok.then(function (res) {
				res.should.be.equal(10);
			});

			ok.done(
				function () {
					done();
				},
				done
			);
		});
	});
});