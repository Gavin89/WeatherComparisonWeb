var mongoose = require( 'mongoose');

var sourceSchema = new mongoose.Schema({
	sourceName: String,
	location_name: String,
	latitude: double,
	longitude: double,
	weather: String,
	icon: String,
	temp: int,
	windspeed: int
	ratings: double
	time: int
});
mongoose.model( 'Sources', sourceSchema );

mongoose.connect( 'mongodb://localhost/test');
