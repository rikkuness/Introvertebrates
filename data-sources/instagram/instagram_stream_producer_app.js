'use strict';


var AWS = require('aws-sdk');
var config = require('./config');
var producer = require('./instagram_stream_producer');

var kinesis_firehose = new AWS.Firehose({apiVersion: '2015-08-04', region: config.region});
producer(kinesis_firehose).run();
