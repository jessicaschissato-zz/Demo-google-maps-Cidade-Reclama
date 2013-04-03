$(document).ready(function() {
	var info = [];
	var aberto;
	
	function initialize() {
		
        var options = {
            zoom: 5,
            center: new google.maps.LatLng(-18.8800397, -47.05878999999999),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("mapa"), options);

        map.setCenter(options.center);
		
        $.getJSON('http://www.cidadereclama.com.br/api/reclamacoes?callback=json', function(json) {
						
			var markers = [];
			
			var reclamacoes = json;

			$.each(reclamacoes, function(index, reclamacao) {

				var id = reclamacao.Id;
				
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(parseInt(reclamacao.Latitude), parseInt(reclamacao.Longitude)),
					title: reclamacao.Endereco
				});
				
				info[id] = new Object;
				info[id].marker = marker;
				
				var options = {
					content: obterContentReclamacao(reclamacao),
					pixelOffset: new google.maps.Size(-160, 0),
					boxStyle: { 
						background: '#fff',
						padding: '10px',
						width: '280px'
					}
				}
				
				info[id].ib = new InfoBox(options);

				info[id].listener = google.maps.event.addListener(marker, 'click', function (e) {
					openInfoBox(id, marker);
				});

				markers.push(marker);
			});
			
			var markerCluster = new MarkerClusterer(map, markers);
		});

        function openInfoBox(id, marker) {
            if (typeof(aberto) == 'number' && typeof(info[aberto].ib) == 'object') {
                info[aberto].ib.close();
            }

            info[id].ib.open(map, marker);
            aberto = id;
        }
		
		function obterContentReclamacao(reclamacao) {
			var html = '<h3>Reclamação: ' + reclamacao.Id + '</h3>' +
				'<p>Endereco: ' + reclamacao.Endereco + '</p>' +
				'<p>Latitude: ' + reclamacao.Latitude + '<br />' +
				'Longitude: ' + reclamacao.Longitude + '</p>';
				
			return html;
		}
	
		var cookieLatitude = getCookie("latitude");
		var cookieLongitude = getCookie("longitude");
	
		if (cookieLatitude != null && cookieLatitude != "" && cookieLongitude != null && cookieLongitude != "") {
			
			map.setCenter(new google.maps.LatLng(cookieLatitude, cookieLongitude));
			map.setZoom(13);
			
		} else if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
	
				setCookie("latitude", position.coords.latitude, 365);
				setCookie("longitude", position.coords.longitude, 365);
	
				map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
				map.setZoom(13);
			});
		}
	}
	
	initialize();
});