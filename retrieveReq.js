var countryInfo = {};
var country = "Australia";
var provinceList = [];
var queryChildren = "http://api.geonames.org/childrenJSON?username=sytheris&geonameId=";

countryInfo[country] = [];

function run() {
  async.waterfall([
    init,
    getStates,
    getProvinces,
    getSuburbs
  ], function (err, result) {
    console.log("finished and stuff");
    var json = JSON.stringify(countryInfo);
    var blob = new Blob([json], {type: "application/json"});
    var url = URL.createObjectURL(blob);

    //console.log(json);
    var a = document.createElement('a');
    a.download = "australia.json";
    a.href = url;
    a.textContent = "Download file";

    document.getElementById('jsonFile').appendChild(a);
  });
}


function init(callback) {
  var query = "http://api.geonames.org/searchJSON?featureCode=PCLI&username=sytheris&name=" + country;

  $.getJSON(query, function (json) {
    console.log("api loaded!");
    }).done(function (json) {
      var country = json.geonames[0].geonameId;
      callback(null, (queryChildren + country));
  });
}

function getStates(query, callback) {
  $.getJSON(query, function (json) {}).done(function (data) {
    var states = data.geonames;
    for (index in states) {
      var state = states[index];
      //console.log(state);
      countryInfo[country].push(state.name);
      countryInfo[state.name] = [];
    }
    callback(null, states);
  });
}

function processState(state, callback) {
  console.log("processing state: " + state.name);
  $.getJSON(queryChildren + state.geonameId, function (data) {
    var provinces = data.geonames;
    for (index in provinces) {
      var province = provinces[index];
      //console.log("inserting " + province.name + "to " + state.name);
      countryInfo[state.name].push(province.name);
      countryInfo[province.name] = [];
      provinceList.push(province);
    }
    callback();
  });
}

function getProvinces(states, callback) {
  async.eachSeries(states, processState, function (data) {
    callback(null);
  });
}

function processProvince(province, callback) {
  console.log("processessing province: " + province.name);
  $.getJSON(queryChildren + province.geonameId, function (data) {
    var suburbs = data.geonames;
      // empty so don't do anything otherwise add suburbs
    if (data.totalResultsCount == 0) {
    }
    else {
      var suburbs  = data.geonames;
      $.each(suburbs, function (i, suburb) {
        countryInfo[province.name].push(suburb.name);
      });
    }
    callback();
  });
}

function getSuburbs(callback) {
  //console.log(province);
  async.eachSeries(provinceList, processProvince, function (data) {
    callback(null);
  });
}
