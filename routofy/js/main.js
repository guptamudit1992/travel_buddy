var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

//cache object
var mapCache = {};
var cacheLimit = 5;

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
	directionsDisplay.setPanel(document.getElementById('directions-panel'));
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
	      directionsDisplay.setPanel(document.getElementById('directions-panel'));
	  }
  }
}

// Function to calculate current path between source and destination 
function calcRoute() {
	var start = document.getElementById('start').value;
	var end = document.getElementById('end').value;

	createGraph(start,end);

	//Setting the cookies
	setCookie("source", start);
	setCookie("destination",end);
}

function createGraph(start,end){		    	
	var map_key = start+"-"+end;
	setCache();
	//Checking for source and destination in Cache
	if(!mapCache[map_key]){
		//console.log("Call API");
		  var request = {
		      origin:start,
		      destination:end,
		      travelMode: google.maps.TravelMode.DRIVING
		  };
		  directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		    	mapCache[map_key] = response;
		        directionsDisplay.setDirections(response);
		    }
		  });
	} else {
		//console.log("Create Map from hash");
		directionsDisplay.setDirections(mapCache[map_key]);
	}
}

//Jquery Function to detect mouse hover on list and load Map for it
$(document).on('hover','#searchList div',function(){
	var start = $(this).find('#source_start').html();
	var end = $(this).find('#destination_end').html();

	createGraph(start,end);
}); 


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


//Populating list of last searches
function enterList() {
	var input_source = document.getElementById('start').value;
	var input_destination = document.getElementById('end').value;
	//Populate the List of last searches
	if(input_source!=null && input_destination!=null) {
		var entry_object = "<div><b>Source</b>: <span id='source_start'>"+input_source +"</span>...<br><b>Destination</b>: <span id='destination_end'>"+input_destination+"</span>...</div>";
		$('#searchList').prepend(entry_object);
	}
	//setCache();
}



//Function to calculate MFU (Most Frequently Used) source and destination and store in Cache (Default size of case - 5)
function setCache(){
	var array_count = {};
	$('#searchList div').each(function(){
		var count = 0;
		var start = $(this).find('#source_start').html();
		var end = $(this).find('#destination_end').html();
		var src_dest = start+"-"+end;

		if(!array_count[src_dest]) {
			array_count[src_dest] = 1;
		} else {
			array_count[src_dest] = array_count[src_dest] + 1;	
		}
	});
	array_count = getSortedKeys(array_count);
	//console.log(mapCache);
} 

//Sorting cache to get top 5 most frequently occured searches
function getSortedKeys(obj) {
    var keys = []; 
    for(var key in obj) {
    	keys.push(key);
    }
    return keys.sort(function(a,b){
    	return obj[b]-obj[a]
   	});
}
