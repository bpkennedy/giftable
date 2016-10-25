'use strict';

var bodyParser = require('body-parser');
var email = require("./email.js");
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan'); // formerly express.logger
var errorhandler = require('errorhandler');
var app = express();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAILACCOUNT,
        pass: process.env.GMAILPASS
    }
});

// parse application/json
app.use(bodyParser.json());

app.post('/postEmail', function(req,res) {
    email.registerEmail(req.body);
    res.send({ status: 'SUCCESS' });
});

// all environments
app.set('port', process.env.PORT || 5000);

// express/connect middleware
app.use(favicon(__dirname + '/favicon.ico'));
app.use(morgan('dev'));
app.use(require('prerender-node').set('prerenderToken', 'uH3TZE7nuQOWHPbgfiIf'));

// serve up static assets
app.use(express.static(path.join(__dirname, '../dist')));

// development only
if ('development' === app.get('env')) {
    app.use(errorhandler());
}

if('production' == app.get('env')) {
app.use(express.static(path.join(__dirname, '../dist')));
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('myApp server listening on port ' + app.get('port'));
});
