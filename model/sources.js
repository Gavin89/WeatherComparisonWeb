var mongoose = require( 'mongoose');

exports.sourcelist = function sourcelist(lname, callback){
	var Sources = mongoose.model( 'Sources');
	Sources.find({'Location':lname}, function (err, sources){
		if(err){
			console.log(err);
		}else{
			console.log(teams);
			callback("", sources);
		}
	})
}