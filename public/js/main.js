 var geocoder;

 $(function() {
 
    geocoder = new google.maps.Geocoder();
	
	 $('#location_search_btn').click(function() {
		var location_name = $('#location_search_name').val();
		search_by_location_keyword(location_name);
	 });
	 
 });
 
 $(function() {
	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(function (position) {
		
		var date = new Date();
		var today_date = date.format("dd-mm-yyyy");
		date.setDate(date.getDate() + 1);
		var tomorrow_date = date.format("dd-mm-yyyy");
				
		var api_url = "locations/by_position/"+position.coords.latitude+"/"+position.coords.longitude+"/";
				
				$.ajax({
					url: api_url+today_date,
					context: document.body,
					dateType: "json"
				}).done(function(data) {
					console.log(today_date);
					parse_data(true, data);
				}).fail(function(err) {
					console.log(err);
				});
				
				$.ajax({
					url: api_url+tomorrow_date,
					context: document.body,
					dateType: "json"
				}).done(function(data) {
					console.log('Tomorrow');
					parse_data(false, data);
				}).fail(function(err) {
					console.log(err);
				});
				
		});
		}
});

 
 
 
var search_by_location_keyword = function(location_name, callback) {
			
		geocoder.geocode( { 'address': location_name}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				
		
				var location = results[0].geometry.location;
					
				var date = new Date();
				var today_date = date.format("dd-mm-yyyy");
				date.setDate(date.getDate() + 1);
				var tomorrow_date = date.format("dd-mm-yyyy");
				
				var api_url = "locations/by_position/"+location.k+"/"+location.D+"/";
				
				$.ajax({
					url: api_url+today_date,
					context: document.body,
					dateType: "json"
				}).done(function(data) {
					console.log(today_date);
					parse_data(true, data);
				}).fail(function(err) {
					console.log(err);
				});
				
				$.ajax({
					url: api_url+tomorrow_date,
					context: document.body,
					dateType: "json"
				}).done(function(data) {
					console.log('Tomorrow');
					parse_data(false, data);
				}).fail(function(err) {
					console.log(err);
				});
				
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
		});			
};
		
		var parsed_data= {};
					
			var parse_data = function(today, data) {
			var mo_data = {};
			var fio_data = {};
			
			data.forEach(function(item) {
			var weather_source = item.weather_source;
			var time = item.time;
			var temperature = item.temperature;
			var summary = item.summary;
			var windspeed = item.windspeed;
			
			var data_obj = {
			time: time,
			temperature: temperature,
			summary: summary,
			windspeed: windspeed
			};
			
			if (weather_source == "MetOffice") {
			mo_data[time] = data_obj;
			} else if (weather_source == "ForecastIO") {
			fio_data[time] = data_obj;
			}
			});
			parsed_data["metoffice"] = mo_data;
			parsed_data["forecastio"] = fio_data;
					
			display_data(today, parsed_data);
			}
					
			var display_data = function(today, data) {
					
				populate_forecast(today, data);
				populate_comparisons(today, data);	
						
			};
					
			var populate_comparisons = function(isToday, data) {
			
				var getLogoEl = function(metoffice) {
					var img = $('<img/>');
					var p = $('<p/>');
					var td = $('<td/>').addClass('mo_logo').append(img).append(p);
					if (metoffice) {		
						img.attr('src', 'images/met-office-logo.png');
						p.text('Met Office');
					} else {
						img.attr('src', 'images/forecast-logo.jpg');
						p.text('ForecastIO');
					}					
					return td;
				}
				
				var getHeaderRow = function() {
				var headerRow = $('<tr/>').html('<th><h4>Source</h4></th><th><h4>0000</h4></th><th><h4>0300</h4></th><th><h4>0600</h4></th><th><h4>0900</h4></th><th><h4>1200</h4></th><th><h4>1500</h4></th><th><h4>1800</h4></th><th><h4>2100</h4></th><th><h4>Rankings</h4></th>');
					
					return headerRow;
				}
					
				//Metoffice
				var temp_table;
				if (isToday) {
					temp_table = $('#temp_comparison_today_table');
				} else {
					temp_table = $('#temp_comparison_tomorrow_table');
				}
				
				var windspeed_table;
				if (isToday) {
					windspeed_table = $('#windspeed_comparison_today_table');
				} else {
					windspeed_table = $('#windspeed_comparison_tomorrow_table');
				}
				
				var summary_table;
				if (isToday) {
					summary_table = $('#summary_comparison_today_table');
				} else {
					summary_table = $('#summary_comparison_tomorrow_table');
				}
				
				temp_table.empty();
				windspeed_table.empty();
				summary_table.empty();
				
				temp_table.append(getHeaderRow());
				windspeed_table.append(getHeaderRow());
				summary_table.append(getHeaderRow());
				
				
				//Temperature
				var temp_metoffice = $('<tr/>');
				temp_metoffice.append(getLogoEl(true));
				var temp_fio = $('<tr/>');
				temp_fio.append(getLogoEl(false));
				
				//Windspeed
				var windspeed_metoffice = $('<tr/>');
				windspeed_metoffice.append(getLogoEl(true));
				var windspeed_fio = $('<tr/>');
				windspeed_fio.append(getLogoEl(false));
				
				//Summary
				var summary_metoffice = $('<tr/>');
				summary_metoffice.append(getLogoEl(true));
				var summary_fio = $('<tr/>');
				summary_fio.append(getLogoEl(false));
				
				temp_table.append(temp_metoffice);
				temp_table.append(temp_fio);
				
				windspeed_table.append(windspeed_metoffice);
				windspeed_table.append(windspeed_fio);
				
				summary_table.append(summary_metoffice);
				summary_table.append(summary_fio);
				
				var metoffice_data = data['metoffice'];
				var fio_data = data['forecastio'];
			
				$.each(metoffice_data, function(index, value) {
					//Temperature
						var temp = value.temperature;
						var temp_col = $('<td/>').text(temp);
						
						if (temp < 0) {
							temp_col.addClass('temp_circle_cold');
						} else if(temp >= 0 && temp <= 10) {
							temp_col.addClass('temp_circle_normal');
						} else if (temp >= 11 && temp <= 20) {
							temp_col.addClass('temp_circle_warm');
						} else {
							temp_col.addClass('temp_circle_hot');
						}
						
						temp_metoffice.append(temp_col);
						
						//Windspeed
						var windspeed = value.windspeed;
						var windspeed_col = $('<td/>').text(windspeed);
						
				
						windspeed_col.addClass('mo_windspeed');
					
						
						windspeed_metoffice.append(windspeed_col);
						
						//Summary
						var summary = value.summary;
						var summary_col = $('<td/>')
						
				
						windspeed_col.addClass('mo_summary');
					
						var img = $('<img/>').addClass('img-circle');
						
						var img_name = '';
						
						switch (summary) {
						
						case 'Sunny day':
								img_name = 'sunny.png';
							break;
							case 'Clear night':
								img_name = 'moon.png';
							break;
							case 'Partly cloudy':
								img_name = 'partly-cloudy.png';
							break;
							case 'Not used':
								img_name = 'na.png';
							break;		
							case 'Mist':
								img_name = 'na.png';
							break;
							case 'Fog':
								img_name = 'fog.png';
							break;
							case 'Cloudy':
								img_name = 'cloudy.png';
							break;
							case 'Overcast':
								img_name = 'overcast.png';
							break;
							case 'Drizzle':
								img_name = 'drizzle.png';
							break;		
							case 'Light rain':
								img_name = 'rainy.png';
							break;
							case 'Heavy rain':
								img_name = 'heavy-rain.png';
							break;
							case 'Sleet':
								img_name = 'sleet.png';
							break;
							case 'Hail':
								img_name = 'hail.png';
							break;		
							case 'Light snow':
								img_name = 'snow.png';
							break;
							case 'Heavy snow':
								img_name = 'blizzard.png';
							break;		
							case 'Thunder':
								img_name = 'thunder.png';
							break;
							case 'Not available':
								img_name = 'na.png';
							break;
						
						}
			
						img.attr('src', 'images/icon-set/PNG/50x50/'+img_name);
						
						summary_col.append(img);
						summary_col.append($('<p/>').text(summary));
						summary_metoffice.append(summary_col);
					
						
					
				});
								
				var index = -3;
					for (var i = 0; i < Object.keys(fio_data).length; i++) {
						
						index += 3;
						if (index > 21) {
							continue;
						}
						
						var value = fio_data[index];
						
						if (value == null) {
							temp_fio.append($('<td/>'));
							windspeed_fio.append($('<td/>'));
							summary_fio.append($('<td/>'));
							continue;
						}
						
						//Temperature
						var temp = value.temperature;
				
						var temp_col = $('<td/>').text(temp);
						
						if (temp < 0) {
							temp_col.addClass('temp_circle_cold');
						} else if(temp >= 0 && temp <= 10) {
							temp_col.addClass('temp_circle_normal');
						} else if (temp >= 11 && temp <= 20) {
							temp_col.addClass('temp_circle_warm');
						} else {
							temp_col.addClass('temp_circle_hot');
						}
						
						temp_fio.append(temp_col);
						
						//Windspeed
						var windspeed = value.windspeed;
						var windspeed_col = $('<td/>').text(windspeed);
						
				
						windspeed_col.addClass('fo_windspeed');
					
						
						windspeed_fio.append(windspeed_col);
					
						//Summary
						var summary = value.summary;
						var summary_col = $('<td/>')
						
				
						windspeed_col.addClass('fo_summary');
					
						var img = $('<img/>').addClass('img-circle');
						
						var img_name = '';
						
						switch (summary) {
						
							case 'Sunny':
								img_name = 'sunny.png';
							break;
							case 'Clear night':
								img_name = 'moon.png';
							break;
							case 'Partly cloudy':
								img_name = 'partly-cloudy.png';
							break;
							case 'Fog':
								img_name = 'fog.png';
							break;
							case 'Cloudy':
								img_name = 'cloudy.png';
							break;
							case 'Cloudy night':
								img_name = 'cloudy-night.png';
							break;
							case 'Wind':
								img_name = 'wind.png';
							break;
							case 'Sleet':
								img_name = 'sleet.png';
							break;
							case 'Hail':
								img_name = 'hail.png';
							break;		
							case 'Snow':
								img_name = 'snow.png';
							break;
							case 'Rain':
								img_name = 'rainy.png';
							break;		
							case 'Thunder':
								img_name = 'thunder.png';
							break;
						
						}
			
						img.attr('src', 'images/icon-set/PNG/50x50/'+img_name);
						
						summary_col.append(img);
						summary_col.append($('<p/>').text(summary));
						summary_fio.append(summary_col);
						
					
					
					}
					
						//Rating
						var rating_col = $('<td/>');
						rating_col.text('Rating Here');
						summary_fio.append(rating_col);
						
						//Rating
						var rating_col = $('<td/>');
						rating_col.text('Rating Here');
						windspeed_fio.append(rating_col);
						
						//Rating
						var rating_col = $('<td/>');
						rating_col.text('Rating Here');
						temp_fio.append(rating_col);
					
						//Rating
						var rating_col = $('<td/>');
						rating_col.text('Rating Here');
						summary_metoffice.append(rating_col);
						
						//Rating
						var rating_col = $('<td/>');
						rating_col.text('Rating Here');
						windspeed_metoffice.append(rating_col);
						
						//Rating
						var rating_col = $('<td/>');
						rating_col.text('Rating Here');
						temp_metoffice.append(rating_col);
					
			}
			
			var populate_forecast = function(isToday, data) {
	
					//Metoffice
					var metoffice_forcast_today_table;
					if (isToday) {
						metoffice_forcast_today_table = $('#metoffice_forecast_today_table');
					} else {
						metoffice_forcast_today_table = $('#metoffice_forecast_tomorrow_table');
					}
				
					metoffice_forcast_today_table.empty();
				
					var metoffice_data = data['metoffice']
					var metoffice_time_row = $('<tr/>');
					var metoffice_temp_row = $('<tr/>');
					var metoffice_windspeed_row = $('<tr/>');
					var metoffice_summary_row = $('<tr/>');
					
					var times = [
					"0000", "0300", "0600", "0900", "1200", "1500", "1800", "2100"];
					
					metoffice_time_row.html('<th><h4>0000</h4></th><th><h4>0300</h4></th><th><h4>0600</h4></th><th><h4>0900</h4></th><th><h4>1200</h4></th><th><h4>1500</h4></th><th><h4>1800</h4></th><th><h4>2100</h4></th>');
						
					
					$.each(metoffice_data, function(index, value) {
						
											
						
						//Temperature
						var temp = value.temperature;
						var temp_col = $('<td/>').text(temp);
						
						if (temp < 0) {
							temp_col.addClass('temp_circle_cold');
						} else if(temp >= 0 && temp <= 10) {
							temp_col.addClass('temp_circle_normal');
						} else if (temp >= 11 && temp <= 20) {
							temp_col.addClass('temp_circle_warm');
						} else {
							temp_col.addClass('temp_circle_hot');
						}
						
						metoffice_temp_row.append(temp_col);
						
						//Windspeed
						var windspeed = value.windspeed;
						var windspeed_col = $('<td/>').text(windspeed);
						
				
						windspeed_col.addClass('mo_windspeed');
					
						
						metoffice_windspeed_row.append(windspeed_col);
						
						//Summary
						var summary = value.summary;
						var summary_col = $('<td/>')
						
				
						windspeed_col.addClass('mo_summary');
					
						var img = $('<img/>').addClass('img-circle');
						
						var img_name = '';
						
						switch (summary) {
						
							case 'Sunny day':
								img_name = 'sunny.png';
							break;
							case 'Clear night':
								img_name = 'moon.png';
							break;
							case 'Partly cloudy':
								img_name = 'partly-cloudy.png';
							break;
							case 'Not used':
								img_name = 'na.png';
							break;		
							case 'Mist':
								img_name = 'na.png';
							break;
							case 'Fog':
								img_name = 'fog.png';
							break;
							case 'Cloudy':
								img_name = 'cloudy.png';
							break;
							case 'Overcast':
								img_name = 'overcast.png';
							break;
							case 'Drizzle':
								img_name = 'drizzle.png';
							break;		
							case 'Light rain':
								img_name = 'rainy.png';
							break;
							case 'Heavy rain':
								img_name = 'heavy-rain.png';
							break;
							case 'Sleet':
								img_name = 'sleet.png';
							break;
							case 'Hail':
								img_name = 'hail.png';
							break;		
							case 'Light snow':
								img_name = 'snow.png';
							break;
							case 'Heavy snow':
								img_name = 'blizzard.png';
							break;		
							case 'Thunder':
								img_name = 'thunder.png';
							break;
							case 'Not available':
								img_name = 'na.png';
							break;
						
						}
					
			
						img.attr('src', 'images/icon-set/PNG/50x50/'+img_name);
						
						summary_col.append(img);
						summary_col.append($('<p/>').text(summary));
						metoffice_summary_row.append(summary_col);
					
					});
					
					metoffice_forcast_today_table.append(metoffice_time_row);
					metoffice_forcast_today_table.append(metoffice_temp_row);
					metoffice_forcast_today_table.append(metoffice_windspeed_row);
					metoffice_forcast_today_table.append(metoffice_summary_row);
					
					
					//Forecast IO
					
					var fio_forcast_today_table;
					if (isToday) {
						fio_forcast_today_table = $('#forecastio_forecast_today_table');
					} else {
						fio_forcast_today_table = $('#forecastio_forecast_tomorrow_table');
					}
					
					fio_forcast_today_table.empty();
				
					var fio_data = data['forecastio']
					var fio_time_row = $('<tr/>');
					var fio_temp_row = $('<tr/>');
					var fio_windspeed_row = $('<tr/>');
					var fio_summary_row = $('<tr/>');
					
					var counter = 0;
					
					fio_time_row.html('<th><h4>0000</h4></th><th><h4>0300</h4></th><th><h4>0600</h4></th><th><h4>0900</h4></th><th><h4>1200</h4></th><th><h4>1500</h4></th><th><h4>1800</h4></th><th><h4>2100</h4></th>');
						
			
					var index = -3;
					for (var i = 0; i < Object.keys(fio_data).length; i++) {
						
						
					
						
						index += 3;
						if (index > 21) {
							continue;
						}
						
						var value = fio_data[index];
						
						if (value == null) {
							fio_temp_row.append($('<td/>'));
							fio_windspeed_row.append($('<td/>'));
							fio_summary_row.append($('<td/>'));
							continue;
						}
						
						
						
						//Temperature
						var temp = value.temperature;
						console.log(index);
						console.log(value);
						var temp_col = $('<td/>').text(temp);
						
						if (temp < 0) {
							temp_col.addClass('temp_circle_cold');
						} else if(temp >= 0 && temp <= 10) {
							temp_col.addClass('temp_circle_normal');
						} else if (temp >= 11 && temp <= 20) {
							temp_col.addClass('temp_circle_warm');
						} else {
							temp_col.addClass('temp_circle_hot');
						}
						
						fio_temp_row.append(temp_col);
						
						//Windspeed
						var windspeed = value.windspeed;
						var windspeed_col = $('<td/>').text(windspeed);
						
				
						windspeed_col.addClass('fo_windspeed');
					
						
						fio_windspeed_row.append(windspeed_col);
					
						//Summary
						var summary = value.summary;
						var summary_col = $('<td/>')
						
				
						windspeed_col.addClass('fo_summary');
					
						var img = $('<img/>').addClass('img-circle');
						
						var img_name = '';
						
						switch (summary) {
						
							case 'Sunny':
								img_name = 'sunny.png';
							break;
							case 'Clear night':
								img_name = 'moon.png';
							break;
							case 'Partly cloudy':
								img_name = 'partly-cloudy.png';
							break;
							case 'Fog':
								img_name = 'fog.png';
							break;
							case 'Cloudy':
								img_name = 'cloudy.png';
							break;
							case 'Cloudy night':
								img_name = 'cloudy-night.png';
							break;
							case 'Wind':
								img_name = 'wind.png';
							break;
							case 'Sleet':
								img_name = 'sleet.png';
							break;
							case 'Hail':
								img_name = 'hail.png';
							break;		
							case 'Snow':
								img_name = 'snow.png';
							break;
							case 'Rain':
								img_name = 'rainy.png';
							break;		
							case 'Thunder':
								img_name = 'thunder.png';
							break;
						
						}
			
						img.attr('src', 'images/icon-set/PNG/50x50/'+img_name);
						
						summary_col.append(img);
						summary_col.append($('<p/>').text(summary));
						fio_summary_row.append(summary_col);
						
						
					
					}
					
					fio_forcast_today_table.append(fio_time_row);
					fio_forcast_today_table.append(fio_temp_row);
					fio_forcast_today_table.append(fio_windspeed_row);
					fio_forcast_today_table.append(fio_summary_row);
			}
	