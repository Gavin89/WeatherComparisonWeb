 var geocoder;
 var summary_metoffice;
 var rmse_data_mo = [];
 var bias_data_mo = [];
 var rmse_data_fio = [];
 var bias_data_fio = [];

 var summary_fio
 $(function() {
 
    geocoder = new google.maps.Geocoder();
	
	 $('#location_search_btn').click(function() {
		var location_name = $('#location_search_name').val();
		search_by_location_keyword(location_name);
	 });
	 
	 
	 $('#location_search_name').bind("enterKey",function(e){
 	var location_name = $('#location_search_name').val();
		search_by_location_keyword(location_name);
});
$('#location_search_name').keyup(function(e){
    if(e.keyCode == 13)
    {
        $(this).trigger("enterKey");
    }
});
 });
 


$(function() {
			rmse_data_mo.length = 0;
			bias_data_mo.length = 0;
			rmse_data_fio.length = 0;
			bias_data_fio.length = 0;
			
			

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (location){
				var date = new Date();
				date.setDate(date.getDate() - 1);
				var today_date = date.format("dd-mm-yyyy");

				var tomorrow_date = date.format("dd-mm-yyyy");
				geocoder = new google.maps.Geocoder();
				longitude = location.coords.longitude; 
				latitude = location.coords.latitude; 
				var latlng = new google.maps.LatLng(latitude, longitude);
				
				geocoder.geocode({ 'latLng': latlng }, function (results, status) {

				var locationTitle; 
				locationTitle = $('#location_name');
		
				var location = results[0].geometry.location;
				var locationTown = results[0].address_components[2].long_name;
				if(typeof (results[0].address_components[4].long_name !== 'undefined')){
				locationCity = results[0].address_components[4].long_name;
				}
				else {
				locationCity = results[0].address_components[2].long_name;
				}
				
				locationTitle.empty();
				locationTitle.append(locationTown + ", " + locationCity);	
    });

				var api_url = "locations/by_position/"+latitude+"/"+longitude+"/";
				var api_calc_url = "calculations/by_position/"+longitude+"/"+latitude+"/";
				console.log(api_url);
				console.log(api_calc_url);
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

				$.ajax({
					url: api_calc_url+today_date,
					context: document.body,
					dateType: "json"
				}).done(function(data) {
					console.log(today_date);
					parse_calculations(true, data);
					parse_calculations(false, data);
				}).fail(function(err) {
					console.log(err);
				});
				
		
				}); 
			} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
		});


 
var search_by_location_keyword = function(location_name, callback) {
			rmse_data_mo.length = 0;
			bias_data_mo.length = 0;
			rmse_data_fio.length = 0;
			bias_data_fio.length = 0;
			var locationCity;
			location_name += ',uk';
			geocoder.geocode( { 'address': location_name}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				
				var locationTitle; 
				locationTitle = $('#location_name');
		
				var location = results[0].geometry.location;
				var locationTown = results[0].address_components[1].long_name;
				try{
				if(typeof (results[0].address_components[3].long_name !== 'undefined')){
				locationCity = results[0].address_components[3].long_name;
				}
				else {
				locationCity = results[0].address_components[4].long_name;
				}
			}
			catch (e){
				
			}
				
				locationTitle.empty();
				locationTitle.append(locationTown + ", " + locationCity);	

				var date = new Date();
				var today_date = date.format("dd-mm-yyyy");
				date.setDate(date.getDate() + 1);
				var tomorrow_date = date.format("dd-mm-yyyy");
				
				var api_url = "locations/by_position/"+location.k+"/"+location.D+"/";
				var api_calc_url = "calculations/by_position/"+location.D+"/"+location.k+"/";
				console.log(api_url);
				console.log(api_calc_url);
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

				$.ajax({
					url: api_calc_url+today_date,
					context: document.body,
					dateType: "json"
				}).done(function(data) {
					console.log(today_date);
					parse_calculations(true, data);
					parse_calculations(false, data);
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
			var location_name = item.location_name;

			
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


			var parse_calculations = function(today, data) {
			
			var met_office_set = false;
			var fio_set = false;
			var mo_data_calc = {};
			var fio_data_calc = {};
			
	
			
			data.forEach(function(item) {
			bias = 0;
			rmse = 0;

			var weather_source1 = item.weather_source;
			bias = item.BIAS;
			rmse = item.RMSE;
			
			if (weather_source1 == "MetOffice"){
			bias_data_mo.push(bias);
			rmse_data_mo.push(rmse);
			}
			else {
			bias_data_fio.push(bias);
			rmse_data_fio.push(rmse);
			}
			
			var rating = 0;
			var score = 2 * Math.abs(bias)+ rmse;
			score = score.toFixed(2);
			console.log(bias);
			if(score <= 0.9) {
				rating = 5;
			}
			else if(score > 0.9 && score <= 1.4) {
				rating = 4;
			}
			else if(score > 1.4 && score <= 2.0) {
				rating = 3;
			}
			else if(score > 2.0 && score <= 2.4) {
				rating = 2
			}
			else if(score > 2.4 && score <= 4.0) {
				rating = 1;
				}
			else
				{
					rating = 0;
				}
							
			
					
						
			if (weather_source1 == "MetOffice" && !met_office_set) {
	
			met_office_set = true;
				if (today) {
					display_rating($('.metofficeRatingToday'), rating, score, rmse);
				} else {
					display_rating($('.metofficeRatingTomorrow'), rating, score, rmse);
				
				}
			} else if (weather_source1 == "ForecastIO" && !fio_set) {
	
			fio_set = true;
				if (today) {
					display_rating($('.fioRatingToday'), rating, score, rmse);
				} else {
					display_rating($('.fioRatingTomorrow'), rating, score, rmse);
				
				}
			}
			});
		
			}
			
			var display_rating = function(el, rating, score, rmse) {
			
			
					el.empty(); 
					var img = $('<img/>').attr('title', "RMSE: "+score+"\nBIAS: "+bias);
					img.attr('src', 'images/'+rating+'-rating.jpg');
					el.append(img);
			
				
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
				summary_metoffice = $('<tr/>');
				summary_metoffice.append(getLogoEl(true));
				summary_fio = $('<tr/>');
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
						var temp_col = $('<td/>').text(temp+"\u00B0" + "C");
						
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
						var windspeed_col = $('<td/>').text(windspeed+'mph');
						
				
						windspeed_col.addClass('mo_windspeed');
									
						windspeed_metoffice.append(windspeed_col);
						
						//Summary
						var summary = value.summary;
						var summary_col = $('<td/>')
											
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
				
							var rmse_mo = 0;
							var bias_mo = 0;
							
							rmse_mo = rmse_data_mo[0];
							bias_mo = bias_data_mo[0];
							
							var rating = 0;
							var score_mo = 2 * Math.abs(bias_mo)+ rmse_mo;
							alert(bias_mo);
							score_mo = score_mo.toFixed(2);
							if(score_mo <= 0.9) {
								rating = 5;
							}
							else if(score_mo > 0.9 && score_mo <= 1.4) {
								rating = 4;score_mo
							}
							else if(score_mo > 1.4 && score_mo <= 2.0) {
								rating = 3;
							}
							else if(score_mo > 2.0 && score_mo <= 2.4) {
								rating = 2
							}
							else if(score_mo > 2.4 && score_mo <= 4.0) {
								rating = 1;
							}
							else
							{
								rating = 0;
							}
							
							
						var rating_col = $('<td/>');
						var img_rating = $('<img/>').attr('title', "RMSE: "+score_mo+"\nBIAS: "+bias_mo);
						img_rating.attr('src', 'images/'+rating+'-rating.jpg');
		
						//Rating
						rating_col.append(img_rating);			
						temp_metoffice.append(rating_col);
					
						var rating_col1 = $('<td/>');
						var img_rating1 = $('<img/>').attr('title', "RMSE: "+score_mo+"\nBIAS: "+bias_mo);
						img_rating1.attr('src', 'images/'+rating+'-rating.jpg');
						rating_col1.append(img_rating1);		
						windspeed_metoffice.append(rating_col1);
						
						var rating_col2 = $('<td/>');
						var img_rating2 = $('<img/>').attr('title', "RMSE: "+score_mo+"\nBIAS: "+bias_mo);
						img_rating2.attr('src', 'images/'+rating+'-rating.jpg');
						rating_col2.append(img_rating2);		
						summary_metoffice.append(rating_col2);
						
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
				
						var temp_col = $('<td/>').text(temp+"\u00B0" + "C");
						
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
						var img_windspeed = $('<img/>').addClass('img-circle');
						var windspeed = value.windspeed;
						var windspeed_col = $('<td/>');
													                    			
						img_windspeed.attr('src', 'images/windspeed.png');
						
						windspeed_col.append(img_windspeed);	
						windspeed_col.append($('<p/>').text(windspeed+'mph'));

						
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
							var rmse_fio = 0;
							var bias_fio = 0;
							
							rmse_fio = rmse_data_fio[0];
							bias_fio = bias_data_fio[0];
							
							var rating = 0;

							var fio_score = 2 * Math.abs(bias_fio) + rmse_fio;
							
							fio_score = fio_score.toFixed(2);
							if(fio_score <= 0.9) {
								rating = 5;
							}
							else if(fio_score > 0.9 && fio_score <= 1.4) {
								rating = 4;
							}
							else if(fio_score > 1.4 && fio_score <= 2.0) {
								rating = 3;
							}
							else if(fio_score > 2.0 && fio_score <= 2.4) {
								rating = 2
							}
							else if(fio_score > 2.4 && fio_score <= 4.0) {
								rating = 1;
							}
							else
							{
								rating = 0;
							}
							
						var rating_col3 = $('<td/>');
						var img_rating3 = $('<img/>').attr('title', "RMSE: "+fio_score+"\nBIAS: "+bias_fio);
						img_rating3.attr('src', 'images/'+rating+'-rating.jpg');
		
						//Rating
						rating_col3.append(img_rating3);			
						temp_fio.append(rating_col3);
					
						var rating_col4 = $('<td/>');
						var img_rating4 = $('<img/>').attr('title', "RMSE: "+fio_score+"\nBIAS: "+bias_fio);
						img_rating4.attr('src', 'images/'+rating+'-rating.jpg');
						rating_col4.append(img_rating4);		
						windspeed_fio.append(rating_col4);
						
						var rating_col5 = $('<td/>');
						var img_rating5 = $('<img/>').attr('title', "RMSE: "+fio_score+"\nBIAS: "+bias_fio);
						img_rating5.attr('src', 'images/'+rating+'-rating.jpg');
						rating_col5.append(img_rating5);		
						summary_fio.append(rating_col5);
					
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
						var temp_col = $('<td/>').text(temp+"\u00B0" + "C");
						
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
						var img_windspeed = $('<img/>').addClass('img-circle');
						var windspeed = value.windspeed;
						var windspeed_col = $('<td/>');
													                    			
						img_windspeed.attr('src', 'images/windspeed.png');
						
						windspeed_col.append(img_windspeed);	
						windspeed_col.append($('<p/>').text(windspeed+'mph'));
		
				
						metoffice_windspeed_row.append(windspeed_col);
						
						//Summary
						var summary = value.summary;
						var summary_col = $('<td/>')
						
				
						summary_col.addClass('mo_summary');
					
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
						
						var temp_col = $('<td/>').text(temp + "\u00B0" + "C");
						
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
						var img_windspeed = $('<img/>').addClass('img-circle');
						var windspeed = value.windspeed;
						var windspeed_col = $('<td/>');
													                    			
						img_windspeed.attr('src', 'images/windspeed.png');
						
						windspeed_col.append(img_windspeed);	
						windspeed_col.append($('<p/>').text(windspeed+'mph'));
		
						
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
	