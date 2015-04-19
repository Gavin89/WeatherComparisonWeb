
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var locationSchema = new mongoose.Schema({
	time: Number,
	weather_source: String,
	location_name: String,
	temperature: Number,
	windspeed: Number,
	date: String,
	latitude: Number,
	longitude: Number,
	summary: String,
	lead_time: Number
},
{ collection : 'weatherData' });

var Location = mongoose.model('Location', locationSchema);