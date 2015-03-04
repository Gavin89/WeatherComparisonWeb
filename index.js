var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/weatherDB');
 
var db = mongoose.connection;

exports.locations = function(lname, callback) { 
db.once('open', function () {

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
});

var Location = db.model('Location', locationSchema);
Location.find({
	'location_name': lname
}, function(err, locations) {
	if(err) {
		OnErr(err, callback);
	} else {
		mongoose.connection.close();
		console.log(locations);
		callback("", teams);
	}
});
});
}

