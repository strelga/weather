"use strict";

var express = require('express');
var bodyParser = require('body-parser');

var expressParameters = {
	host : process.env.EXPRESS_HOST,
	port : process.env.EXPRESS_PORT
};

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./routes')(app);

app.use(function (err, req, res, next) {
	if (process.env.NODE_ENV !== 'test') {
		console.error(err.stack || err);
		console.error();
	}

	if (+err.message < 500) {
		return res.status(400).send();
	} else {
		return res.status(500).send();
	}
});

if (process.env.NODE_ENV !== 'test') {
	app.listen(expressParameters.port, expressParameters.host, function (error) {
		if (error) {
		    console.error({err : error}, "Unable to listen to connections");
		    process.exit(10);
		}
		console.info("expressStub is listening on http://" +
		    expressParameters.host + ":" + expressParameters.port);
	});	
}

module.exports = app;