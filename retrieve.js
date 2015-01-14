var creditUsed;

var currentLevel;
var numChildren;

var listPlaces = [];


function load() {
  creditUsed = 0;
  currentLevel = 0;
  numChildren = 0;
  var searchQuery = "Australia"
  var query = "http://api.geonames.org/searchJSON?featureCode=PCLI&username=sytheris&name=" + searchQuery;
  //console.log(query);
  $.getJSON(query, function(json) {
    creditUsed++;
    var country = json.geonames[0];
    //console.log(json);
    getStates(country.geonameId, country.name); 
    //console.log("credit used for search: " + creditUsed);
  });
}

function getStates(id, country) {
  var query = "http://api.geonames.org/childrenJSON?username=sytheris&geonameId=" + id;
  
  $.getJSON(query, function(json) {
    creditUsed++;

    //console.log(json);
    //console.log(json.totalResultsCount);
    states = json.geonames;
    for (var i = 0; i < states.length; i++) {
      var state = states[i];
      //console.log(state);
      getProvinces(state.geonameId, country, state.name);
    }
  });

}

function getProvinces(id, country, state) {
  var query = "http://api.geonames.org/childrenJSON?username=sytheris&geonameId=" + id;
  //console.log(query);
  
  $.getJSON(query, function(json) {
    var provinces = json.geonames;
    for (var i = 0; i < provinces.length; i++) {
      var province = provinces[i];
      //console.log(province);
      resolveTips(province.geonameId, country, state, province.name);
    }
  });
}

function resolveTips(id, country, state, province) {
  var query = "http://api.geonames.org/childrenJSON?username=sytheris&geonameId=" + id;
  var br = " / ";
  //console.log(query);
 
  $.getJSON(query, function(json) {
    if (json.totalResultsCount == 0) {
      console.log(country + br + state + br + province);
    }
    else {
      var tips = json.geonames;
      for (var i = 0; i < tips.length; i++) {
        var tip = tips[i];
        //console.log(tip);
        console.log(country + br + state + br + province + br + tip.name);
      }
    }
  });

}

/*
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
*/
/*
 for when I overload it
bject {status: Object}status: Objectmessage: "the hourly limit of 2000 credits for sytheris has been exceeded. Please throttle your requests or use the commercial service."value: 19
*/
