"use strict";

var path = require('path');

var bunyan = require('bunyan');

var serializers = {
	req : function (req) {
		if (!req || !req.connection)
	        return req;

	    var toReturn = {
	        method: req.method,
	        url: req.url,
	        remoteAddress: req.connection.remoteAddress,
	        remotePort: req.connection.remotePort,
	    };

	    if (req.body) {
	    	toReturn.body = req.body;
	    }

	    return toReturn;
	},
	res : function(res) {
		if (!res || !res.statusCode)
	        return res;

	    return {
	        status: res.statusCode,
	        responseTime : res.responseTime,
	        responseData : res.responseData
	    }
	},
	err : bunyan.stdSerializers.err
};

var logger = bunyan.createLogger({
	name : 'uploader',
	streams : [
		{
			level : 'info',
			path : path.join(__dirname, './logs/weather_info.log')
		},
		{
			level : 'warn',
			path : path.join(__dirname, './logs/weather_warn.log')
		}
	],
	serializers : serializers
});

process.on('SIGHUP', function () {
	logger.reopenFileStreams();
});


module.exports = logger;