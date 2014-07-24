var mongoose = require( 'mongoose'),
	Sources = mongoose.model('Sources');
exports.index = function(req, res) {
	Sources.create({
		sourceName: "MetOffice",
		location_name: "London",
		latitude: 29.1,
		longitude: 2.1,
		weather: "Sunny",
		icon: "Sunny",
		temp: 20,
		windspeed: 10,
		ratings: 5.43,
		time: 0300
	}, function(err, sources){
		var strOutput;
		res.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		if(err){
			console.log(err);
			strOutput = 'Oh dear, we\'ve got an error';
		}else{
			console.log('Source Created: ' + sources);
			strOutput = sources.sourceName + ' created in Source ' + sources.location_name
			+ '\nat ' + sources.time;
		}
		res.write(strOutput);
		res.end();
	});
};