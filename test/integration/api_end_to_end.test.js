"use strict";

var should = require('chai').should();

var dataGetters = require('../../lib/apis/end_to_end');

describe('end_to_end', function () {
	it('should return dataGetters that can fetch data from APIs and transform it to the internal representation', function (done) {
		var ok = dataGetters['openweathermap']('london');

		ok = ok.then(function (internal) {
			console.log(internal);

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