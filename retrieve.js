var creditUsed;

var currentLevel;
var numChildren;

var listPlaces = [];


function load() {
  creditUsed = 0;
  currentLevel = 0;
  numChildren = 0;
  var searchQuery = "Australia"
  var query = "http://api.geonames.org/searchJSON?featureCode=PCLI&name=" + searchQuery + "&username=sytheris";
  console.log(query);
  $.getJSON(query, function(json) {
    creditUsed++;
    var country = json.geonames[0];
    console.log(json);
    getChildren(country.geonameId, 0, 0); 
    /*
    for (var i = 0; i < country.length; i++) {
      var child = country[i];
      console.log(child);
      console.log("name: " + child.name);
      console.log("id: " + child.geonameId);
      console.log("coordinates: " + child.lat + ", " + child.lng);
      for (key in child) {
        console.log("key is " + key);
        console.log("value is " + child[key]);
      }
    }
    */
    console.log("credit used for search: " + creditUsed);
  });
  
  console.log("we are at the very end here! :)");
}

function getChildren(guardian, depth, index) {
  console.log("Guardian: " + guardian + " depth: " + depth + " index: " + index);
  var query = "http://api.geonames.org/childrenJSON?geonameId=" + guardian + "&username=sytheris";
  console.log(query);
  
  if (depth == 3) {
    console.log("depth limit reached");
    return;
  }

  $.getJSON(query, function(json) {
    creditUsed++;
    console.log(json);
    console.log(json.totalResultsCount);
    if (json.totalResultsCount == 0) {
      console.log("this is the end of this line");
      return;
    } 
    else {
      var children = json.geonames;
      console.log("number of children is: " + children.length);
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        console.log(child);
        getChildren(child.geonameId, depth + 1, i);
      }
    }
    console.log("credit used for children: " + creditUsed);
  }); 
}

/*
 for when I overload it
bject {status: Object}status: Objectmessage: "the hourly limit of 2000 credits for sytheris has been exceeded. Please throttle your requests or use the commercial service."value: 19
*/
