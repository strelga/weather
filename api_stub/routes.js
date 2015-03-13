"use strict";

var node = require('./node');

function get_weather (req, res, next) {
	var query = req.query.q;

	var weather = node.getWeatherStub(query);

	res.send(weather);
}

function setup(app) {
    app.get("/weather", get_weather);
}

module.exports = setup;