var mongoose = require( 'mongoose');

var sourceSchema = new mongoose.Schema({
	sourceName: String,
	location_name: String,
	latitude: Number,
	longitude: Number,
	weather: String,
	icon: String,
	temp: Number,
	windspeed: Number,
	ratings: Number,
	time: Number
});
mongoose.model( 'Sources', sourceSchema );

mongoose.connect( 'mongodb://localhost/test');
