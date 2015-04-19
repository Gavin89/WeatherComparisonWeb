
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var calculationSchema = new mongoose.Schema({
	bias: Number,
	weather_source: String,
	location_name: String,
	rmse: Number,
	date: String,
	latitude: Number,
	longitude: Number
},
{ collection : 'weatherCalculations' });

var Calculation = mongoose.model('Calculation', calculationSchema);