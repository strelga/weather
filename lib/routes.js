"use strict";

var node = require('./node');

function get_weather (req, res, next) {
	var query = req.query.q;

	var ok = node.getWeather(query);

	ok.done(
		function (weather) {
			res.send(weather);
		},
		function (err) {
			next(err);
		}
	);
}

function setup(app) {
    app.get("/weather", get_weather);
}

module.exports = setup;