"use strict";

var should = require('chai').should();

var dataGetters = require('../../lib/apis/to_internal_data');

describe.only('to_internal_data', function () {
	it('should return dataGetters that can fetch data from APIs and transform it to the internal representation', function (done) {
		var ok = dataGetters['openweathermap']('London,uk');

		ok = ok.then(function (internal) {
			internal.should.include.keys('temp');
		});

		ok.done(
			function () {
				done();
			},
			done
		);
	});
});