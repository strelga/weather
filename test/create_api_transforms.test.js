"use strict";

var should = require('chai').should();

var createTransforms = require('../lib/apis/create_api_transforms');

describe('create_api_transforms', function () {
	describe('#createTransforms', function () {
		it('should return proper transform functions', function () {
			var transforms = createTransforms({
				'openweathermap' : {
					temp : function (obj) {
						return obj.main.temp;
					},
					humidity : function (obj) {
						return obj.main.humidity;
					}
				}
			});

			var externalApiObject = {main : {temp : 10, humidity : 51}};

			var internalApiObject = transforms['openweathermap'](externalApiObject);

			internalApiObject.should.be.deep.equal({ temp: 10, humidity: 51 });
		});
	});
});