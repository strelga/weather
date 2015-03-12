"use strict";

var should = require('chai').should();

var requests = require('../lib/apis/requests');

describe('requests', function () {
	describe('#openweathermap', function () {
		it('should return proper fields', function (done) {
			var ok = requests['openweathermap']('London,uk');

			ok = ok.then(function (data) {
				data.main.temp.should.be.a('number');
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