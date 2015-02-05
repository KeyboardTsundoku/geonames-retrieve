var creditUsed;

var currentLevel;
var numChildren;

function getCountryInfo() {
  var searchQuery = "Australia";

  console.time("Country JSON");
  getCountry(searchQuery, function(countryInfo) {
    console.log(countryInfo);
    console.dir(countryInfo);
    console.log(JSON.stringify(countryInfo));
  });

  console.timeEnd("Country JSON");
}

function getCountry(searchQuery, res) {
  creditUsed = 0;
  currentLevel = 0;
  numChildren = 0;
  var query = "http://api.geonames.org/searchJSON?featureCode=PCLI&username=sytheris&name=" + searchQuery;
  //console.log(query);
  $.getJSON(query, function(json) {
    creditUsed++;
    var countryInfo = {};
    var country = json.geonames[0];
    countryInfo[country.name] = [];
    //console.log(json);
    getStates(country.geonameId, country.name, function(states) {
      countryInfo[country.name] = states; 
    });
    //countryInfo.country.name; 
    //console.log("credit used for search: " + creditUsed);
    res(countryInfo);
  });
}

function getStates(id, country, res) {
  var query = "http://api.geonames.org/childrenJSON?username=sytheris&geonameId=" + id;
  $.getJSON(query, function(json) {
    creditUsed++;
    var temp = [];
    //console.log(json);
    //console.log(json.totalResultsCount);
    states = json.geonames;

    // there is a .each function or something that you have to use to apply callbacks to eveything
    for (var i = 0; i < states.length; i++) {
      var state = states[i];
      //console.log(state);
      temp.push(state.name);
      getProvinces(state.geonameId, country, state.name, function(state, provinces) {
        temp[state] = provinces;
        //console.log(state + " has been processed!");
      });
    }
    console.log(JSON.stringify(temp));
    res(temp);
    //console.log(countryInfo);
  });

}

function getProvinces(id, country, state, res) {
  var query = "http://api.geonames.org/childrenJSON?username=sytheris&geonameId=" + id;
  //console.log(query);
  
  $.getJSON(query, function(json) {
    creditUsed++;
    var temp = [];
    var provinces = json.geonames;
    for (var i = 0; i < provinces.length; i++) {
      var province = provinces[i];
      //console.log(province);
      temp.push(province.name);
      resolveTips(province.geonameId, country, state, province, function(province, tip) {
        temp[province.name] = tip;
      });
    }
    res(state, temp);
  });
}

function resolveTips(id, country, state, province, res) {
  var query = "http://api.geonames.org/childrenJSON?username=sytheris&geonameId=" + id;
  var br = " / ";
  //console.log(query);
 
  $.getJSON(query, function(json) {
    var temp = [];
    if (json.totalResultsCount == 0) {
      //console.log(country + br + state + br + province);
      temp.push(province);
    }
    else {
      var tips = json.geonames;
      for (var i = 0; i < tips.length; i++) {
        var tip = tips[i];
        temp.push(tip);
        //console.log(tip);
        //console.log(country + br + state + br + province + br + tip.name);
      }
    }
    res(province, temp);
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
