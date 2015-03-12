"use strict";

var adapters = require('./adapters');

function createSingleTransform (adapter) {
	return function (obj) {
		var result = {};

		for (var param in adapter) {
			result[param] = adapter[param](obj);
		}

		return result;
	};
}

/**
 * Creates transforms for each adapter. Transform is a function that
 * takes an instance of the adaptee API and returns an instance of 
 * the client API.
 * @param  {Object} adapters 	key - adaptee API name,
 *                            	value - the adapter
 * @return {Object}
 */
function createTransforms (adapters) {
	var transforms = {};

	for (var api in adapters) {
		transforms[api] = createSingleTransform(adapters[api]);
	}

	return transforms;
}

module.exports = createTransforms;