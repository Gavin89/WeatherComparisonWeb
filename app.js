/*
 * Main App file App.js
 * @author Achraf Ben Younes
 */


// Dependencies requirements, Express 4
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require("mongoose");
var app            = express();
var fs 			   = require('fs');	
var locations      = require('./models/locations');

app.use(express.static(__dirname + '/public')); 	// set the static files location
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT

//Add the routes

// The configuration needed for MongoDB connection
mongoose.connect('mongodb://localhost/weatherDB', function(err, res) {
  if(err) {
    console.log('error while trying to connect to MongoDB Database. ' + err);
  } else {
    console.log('successful connection to database');
  }
});

app.listen(3000);
console.log('Listening on port 3000'); 			

var Location = mongoose.model('Location', Location);

app.get('/locations/by_name/:location_name/:date', function(req, res) {
Location.find({location_name: req.params.location_name, date: req.params.date}, function(error, location){
    if(error){
        res.json(error);
    }
    else if(location == null){
        res.json('no such location')
    } else {
    	res.send(location)
    }
});
});

app.get('/locations/by_position/:lng/:lat/:date', function(req, res) {
Location.find({longitude: req.params.lng, latitude: req.params.lat}, function(error, location){
    if(error){
        res.json(error);
    }
    else if(location == null){
        res.json('no such location')
    } else {
    	res.send(location)
    }
});
});