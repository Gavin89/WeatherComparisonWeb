/**
 * the VhostManagerModel represent the result of executing of the folowing shell command:
 * ./bin/ShellVhostManager.sh -p myprojects -H prestashop -d "fr|com|tk" -f ous -c prestashop -m ous
 *
 * @module      :: Model
 * @description :: Represent data model for the exec shell command
 * @author		:: Achraf Ben Younes
 */

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