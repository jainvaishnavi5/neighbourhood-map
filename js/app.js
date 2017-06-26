/* array containing places*/
var neighbour = [
{
	title: 'Bhangarh Fort',
	lat: 27.0965,
	lng: 76.2860,
	country: 'India'
}, 
{
	title: 'Highgate Cemetery',
	lat: 51.5669,
	lng: -0.1471,
	country: 'London'
}, 
{
	title: 'Screaming Tunnel',
	lat: 43.1456,
	lng: -79.1450,
	country: 'Ontario'
}, 
{
	title: 'Changi Beach',
	lat: 1.3909,
	lng: 103.9921,
	country: 'Singapore'
}, 
{
	title: 'Monte Cristo',
	lat: 42.3357,
	lng: 10.3105,
	country: 'Italy'
	}
];
var List = [];
var VM = function() {	//function showing info box
	var self = this;
	var infoBox = new google.maps.InfoWindow({maxWidth: 300,});
	neighbour.forEach(function(n) {
		var placeMark = new google.maps.Marker({
			map: map,
			position: { lat: n.lat, lng: n.lng },
			title: n.title,
			icon:"pin-in-the-map.png",
			country: n.country,
			filtered: ko.observable(true),
			animation: google.maps.Animation.DROP,
		});
		List.push(placeMark);
		info(placeMark);
		placeMark.addListener('click', function() {
			openBox(this, infoBox);
			AniBounce(this);
		});
	});
	function AniBounce(placeMark) {		//function giving bounce to cursors
		placeMark.setVisible(true);
		placeMark.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function () {
        placeMark.setAnimation(null);
      }, 2100);
		openBox(placeMark, infoBox);	
	}
	function openBox(placeMark, infoBox) {		//function to open infobox
		infoBox.placeMark = placeMark;
		var imscript= '<img src="'+placeMark.gim+'" style="height:200px;width:300 px;" alt="'+placeMark.title+'"/>'
		var er='could not find image';
		placeMark.gim?imscript=imscript:imscript=er;
		infoBox.setContent('<div><h3><center><b>' + placeMark.title +',</b><br>'+placeMark.country+ '</center></h3>'+ imscript+'<br><br>'+ placeMark.wikiresponse +'</div>');
		infoBox.open(map, placeMark);
		// Make sure the marker property is cleared if the infoBox is closed.
		infoBox.addListener('closeclick', function() {
			infoBox.placeMark = null;
		});
	}
	
	this.searchList = ko.observable('');
	this.search = function() { 	//function for searchbar operations
		var place = this.searchList();
		infoBox.close();
		//closing the windows
		if (place.length === 0) {
			List.forEach(function(li) {see(li);});
		} else {
			List.forEach(function(li) {
				//shortlisting of items in the list
				var small=li.title.toLowerCase();
				small.indexOf(place.toLowerCase()) >= 0?see(li):see(li,false);
				});
		}
		infoBox.close();
	};
	
	this.show = function(placeMark) {
		see(placeMark,true);
		AniBounce(this);
	};
	// filtering of list
	function see(x,y=true) {
		x.filtered(y);
				x.setVisible(y);
	};
	function info(placeMark) {
    $.ajax({
      type: "GET",
      url: 'https://en.wikipedia.org/w/api.php' +
      '?action=opensearch' +
      '&search=' + placeMark.title +          // search query
      '&limit=1' +          // return only the first wikipediaResult
      '&namespace=0' +         // search only articles, ignoring Talk, Mediawiki, etc.
      '&format=json',
      dataType: "jsonp",
      success: function (response) {    //success function works when above connection is successfull.
        var wikiRs = response[2][0];
		wikiRs?placeMark.wikiresponse = wikiRs:placeMark.wikiresponse = "Rating Not Found";
      },
      error: function (r) {      //success function works when above connection fails.
        alert("Error loading wikipedia "+r);
      }
    });
	
	var apiKey = '7xe5qqkfsd67ad5qmwmcj52c'; //gettyimages key
	var x = placeMark.title;  //marker title
	$.ajax({
		type: 'GET',	
		beforeSend: function (request) {
			request.setRequestHeader("Api-Key", apiKey);
		},
		url: "https://api.gettyimages.com/v3/search/images/creative?phrase=" + x,
	}).done(function (response) { //successful connection
			placeMark.gim=response.images[0].display_sizes[0].uri;
		})
	.fail(function (response) { //failure function
		window.alert(JSON.stringify(response, 2));
	});
  }
};
var map;
function mapInit() {	//function to initialize the map
    map = new google.maps.Map(document.getElementById('map'), {
            center: {  lat: 47.744788,lng: 32.584842},
            zoom:2
        });
        ko.applyBindings(new VM());
}
//map error function
function maper(){
  alert("Map Not Found");
}
