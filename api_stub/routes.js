"use strict";

var model = require('./model');

function get_weather (req, res, next) {
	var query = req.query.q;

	var weather = model.getWeatherStub(query);

	res.send(weather);
}

function setup(app) {
    app.get("/weather", get_weather);
}

module.exports = setup;