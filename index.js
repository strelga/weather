"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var loggerMiddlewareFactory = require('express-bunyan-logger');

var parameters = require('./config/parameters');
var logger = require('./logger');

var loggerMiddleware = loggerMiddlewareFactory(logger);
var errorHelperMiddleware = loggerMiddlewareFactory.errorHelper;

var app = express();

app.use(loggerMiddleware);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./lib/routes')(app);

app.use(errorHelperMiddleware);

app.listen(parameters.express.port, parameters.express.ip, function (error) {
	if (error) {
	    logger.error({err : error}, "Unable to listen to connections");
	    process.exit(10);
	}
	logger.info("express is listening on http://" +
	    parameters.express.ip + ":" + parameters.express.port);
});