"use strict";

function get_weather (req, res, next) {
	res.send('OK');
}

function setup(app) {
    app.get("/weather", get_weather);
}

module.exports = setup;