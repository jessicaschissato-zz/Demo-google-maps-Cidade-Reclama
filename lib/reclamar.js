$(document).ready(function() {
	var map;
	var marker;
	var geocoder;
	
	function initialize() {
		
		var options = {
			zoom: 5,
			center: new google.maps.LatLng(-18.8800397, -47.05878999999999),
			mapTypeId: google.maps.MapTypeId.ROADMAP //ROADMAP, SATELLITE, HYBRID, TERRAIN
		};
	
		map = new google.maps.Map(document.getElementById("mapa"), options);
	
		marker = new google.maps.Marker({
			map: map,
			position: options.center,
			draggable: true
		});
			
		geocoder = new google.maps.Geocoder();
	}

	initialize();
		
	function mostrarNoMapa() {
		var endereco = $('#endereco').val();
		
		if (endereco != "") {
			geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK && results[0]) {
						var latitude = results[0].geometry.location.lat();
						var longitude = results[0].geometry.location.lng();
	
						$('#endereco').val(results[0].formatted_address);
						$('#latitude').val(latitude);
						$('#longitude').val(longitude);
	
						var location = new google.maps.LatLng(latitude, longitude);
						marker.setPosition(location);
						map.setCenter(location);
						map.setZoom(16);
				}
			});
		}
	}
			
	$('#endereco').focus().blur(mostrarNoMapa);	
	$('#mostrar').click(mostrarNoMapa);
	
	//Reverse geocoding
    google.maps.event.addListener(marker, 'drag', function () {
        geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK && results[0]) {
				$('#endereco').val(results[0].formatted_address);
				$('#latitude').val(marker.getPosition().lat());
				$('#longitude').val(marker.getPosition().lng());
            }
        });
    });
	
	$('#endereco').autocomplete({
		source: function (request, response) {
			geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
				response($.map(results, function (item) {
					return {
						label: item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
						longitude: item.geometry.location.lng()
					}
				}));
			})
		},
		select: function (event, ui) {
			$('#latitude').val(ui.item.latitude);
			$('#longitude').val(ui.item.longitude);
			var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
			marker.setPosition(location);
			map.setCenter(location);
			map.setZoom(16);
		}
	});
	
	$('form').submit(function() {
		alert('Endereço: ' + $('#endereco').val() + '\nLatitude: ' + $('#latitude').val() + '\nLongitude: ' + $('#longitude').val());
		
		return false;		
	});
});