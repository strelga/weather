"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var loggerMiddlewareFactory = require('express-bunyan-logger');

var parameters = require('./config/parameters');
var logger = require('./logger');
var runApiStubs = require('./api_stub/run');

var loggerMiddleware = loggerMiddlewareFactory(logger);
var errorHelperMiddleware = loggerMiddlewareFactory.errorHelper;

var app = express();

app.use(loggerMiddleware);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./lib/routes')(app);

app.use(errorHelperMiddleware);

if (process.env.NODE_ENV !== 'test') {
	app.listen(parameters.express.port, parameters.express.host, function (error) {
		if (error) {
		    logger.error({err : error}, "Unable to listen to connections");
		    process.exit(1);
		}
		logger.info("express is listening on http://" +
		    parameters.express.host + ":" + parameters.express.port);
	});
}

module.exports = runApiStubs().then(function () {
	return app;
});