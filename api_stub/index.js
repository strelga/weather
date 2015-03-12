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

// FORK is set only if this process is a child. So, if it is a test env,
// we are not able to use app directly for testing and need to test if via the network.
// We don't want express to listen only in the case when we are testing and have access to
// the app object.
if (process.env.NODE_ENV !== 'test' || process.env.FORK) {
	app.listen(expressParameters.port, expressParameters.host, function (error) {
		if (error) {
		    console.error({err : error}, "Unable to listen to connections");
		    process.exit(1);
		}

		if (typeof process.send === 'function') {
			process.send({listening : true});
		}
		
		console.info("expressStub is listening on http://" +
		    expressParameters.host + ":" + expressParameters.port);
	});	
}

module.exports = app;

// Detecting that parent died
process.on('disconnect', function () {
	process.exit(0);
});