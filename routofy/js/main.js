var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

// Function to Load current location of user on Google Map 
function initialize() {
  //TODO : Check for cookie stored in browser to get details of last search done by the user

  if(getCookie("source")!=null && getCookie("destination")!=null) {
  	
  	document.getElementById('start').value = getCookie("source");
  	document.getElementById('end').value = getCookie("destination");

  	//If cookie in present in browser fetch and calculate map
  	var geocoder = geocoder = new google.maps.Geocoder();
  	directionsDisplay = new google.maps.DirectionsRenderer();
	var mapOptions = {
	    zoom:7
	};      
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	directionsDisplay.setMap(map);
  	calcRoute();

  } else {
  	  //Fetch default location if browser cookie not available
	  if (navigator.geolocation) {
	      navigator.geolocation.getCurrentPosition(showPosition);
	  } else {
	      x.innerHTML = "Geolocation is not supported by this browser.";
	  }

	  function showPosition(position) {
	      var latitude = position.coords.latitude;
	      var longitude = position.coords.longitude;  

	      // To Fetch Current Location of user
	      var latlng = new google.maps.LatLng(latitude, longitude);
	      var geocoder = geocoder = new google.maps.Geocoder();
	      geocoder.geocode({ 'latLng': latlng }, function (results, status) {
	          if (status == google.maps.GeocoderStatus.OK) {
	              if (results[1]) {
	                  document.getElementById('start').value = results[1].formatted_address;
	              }
	          }
	      });
	      directionsDisplay = new google.maps.DirectionsRenderer();
	      var loc = new google.maps.LatLng(latitude, longitude);
	      var mapOptions = {
	        zoom:7,
	        center:loc
	      };      
	      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	      directionsDisplay.setMap(map);
	  }
  }
}

// Function to calculate current path between source and destination 
function calcRoute() {
	var start = document.getElementById('start').value;
	var end = document.getElementById('end').value;

	  var request = {
	      origin:start,
	      destination:end,
	      travelMode: google.maps.TravelMode.DRIVING
	  };
	  directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response);
	    }
	  });

	//Setting the cookies
	setCookie("source", start);
	setCookie("destination",end);
}

google.maps.event.addDomListener(window, 'load', initialize);


//Setter and Getter for cookies to store user data for a day
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

//Fetch autofill for source and destination
function getLocale() {
	// Create the search box and link it to the UI element.
	var input_start = /** @type {HTMLInputElement} */(
	    document.getElementById('start'));
	var input_end = /** @type {HTMLInputElement} */(
	    document.getElementById('end'));

	var searchBox = new google.maps.places.SearchBox(
	  /** @type {HTMLInputElement} */(input_end));

	var searchBox = new google.maps.places.SearchBox(
	  /** @type {HTMLInputElement} */(input_start));
}