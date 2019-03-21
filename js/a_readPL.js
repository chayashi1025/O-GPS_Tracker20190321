'use strict';
var runnerDictionary = [];
var runnerArray = [];
const MAX_ORBIT_LENGTH = 720; //interval=5s

function init_a_readRunnerListFromJSON() {
  //setRelayRunner();
  setOfficialRaceRunner();
}

function setRelayRunner() {
  var runnerListURL = './json/runner_relay.json';

  $.getJSON(runnerListURL, function(data) {
    for (var i = 0; i < data.length; i += 2) {
      var r13 = data[i];
      var r2 = data[i + 1];
      makeRunnerListHTML(r13, r2);
      makeRunnerArray(r13, r2);
    }
    createRunnerGroupSelector();
  });

}

function setOfficialRaceRunner() {
  var runnerListURL = './json/runner_official.json'; //official
  $.getJSON(runnerListURL, function(data) {
    var r2 = {
      id: "dummy",
      name: "---",
      team: "---",
      order: ""
    }

    for (var i = 0; i < data.length; i += 1) {
      var r13 = data[i];
      makeRunnerListHTML(r13, r2);
      makeRunnerArray(r13, r2);
    }
    createRunnerGroupSelector();
  });
}

function Runner(id, name, team, color, order) {
  this.id = id;
  this.name = name;
  this.team = team;
  this.visible = false;
  this.location = [];
  this.color = color;
  this.orbitPolyline = [];
  this.edgePolyline = [];
  this.circleMarker = [];
  this.labelForMarker = [];
  this.order = order;
  this.lastUpdatedTime = "";
  this.displayOption = "middle"
};
Runner.prototype.displayParam = {
  small: [2, 4, 4, 0],
  middle: [3.5, 6, 7, 3],
  large: [7, 10, 9, 10]
}; //orbitWidth, edgeWidth,markerRadius
Runner.prototype.maxOrbitLength = MAX_ORBIT_LENGTH;
Runner.prototype.visibleOrbitLength = 300;
Runner.prototype.enableMarker = function() {
  var nowLocation = this.location[this.location.length - 1];
  var divIconLoc = this.getNameLabelLatLng(nowLocation);
  var divIcon = L.divIcon({
    className: 'iconLabel',
    html: ('<div><span class="middle">' + this.team + " " + this.name + '</span></div>'),
    iconSize: [100, 50]
  });
  this.labelForMarker = L.marker(divIconLoc, {
    icon: divIcon
  });
  this.orbitPolyline = L.polyline(this.getValidVisibleLocation(), {
    color: this.color,
    opacity: 0.50,
    weight: Runner.prototype.displayParam[this.displayOption][0]
  });
  this.edgePolyline = L.polyline(this.getValidVisibleLocation(), {
    color: "#EEEEEE",
    opacity: 0.5,
    weight: Runner.prototype.displayParam[this.displayOption][1]
  });
  this.circleMarker = L.circleMarker(nowLocation, {
    color: "#505050",
    fillColor: this.color,
    fillOpacity: 0.8,
    radius: Runner.prototype.displayParam[this.displayOption][2]
  });
  this.edgePolyline.addTo(map);
  this.orbitPolyline.addTo(map);
  this.labelForMarker.addTo(map);
  this.circleMarker.addTo(map);
};
Runner.prototype.disableMarker = function() {
  this.labelForMarker.remove();
  this.orbitPolyline.remove();
  this.edgePolyline.remove();
  this.circleMarker.remove();
};
Runner.prototype.updateOrbit = function(latLng, time) {
  if (time < this.lastUpdatedTime) {
    printError('date is not latest:' + latLng + time)
    return null;
  }
  if (this.location != null) {
    if (this.location.length >= Runner.prototype.maxOrbitLength) {
      this.location.shift();
    };
  };
  if (this.checkBugLocation(latLng)) {
    this.lastUpdatedTime = time;
    this.location.push(latLng);
    this.updateView();
  }
};
Runner.prototype.updateView = function() {
  if (this.visible&this.location.length>1) {
    var nowLocation = this.location[this.location.length - 1];
    this.orbitPolyline.setLatLngs(this.getValidVisibleLocation());
    this.edgePolyline.setLatLngs(this.getValidVisibleLocation());
    this.labelForMarker.setLatLng(this.getNameLabelLatLng(nowLocation));
    this.circleMarker.setLatLng(nowLocation);
  }
};
Runner.prototype.setVisibleOrbitLength = function(newLength) {
  this.visibleOrbitLength = newLength;
}
Runner.prototype.getValidVisibleLocation = function() {
  if (this.location.length > this.visibleOrbitLength) {
    return this.location.slice(this.location.length - this.visibleOrbitLength)
  }
  return this.location
}
Runner.prototype.checkBugLocation = function(latLng) {
  if (Math.abs(latLng[0] - 35.5) < 3 && Math.abs(latLng[1] - 137) < 3) {
    return true;
  };
  printError('LatLng Value exception:' + latLng + ":" + this.id)
  return false;
}
Runner.prototype.setDisplaySize = function(size) {
  this.displayOption = size;
  setIconLabelTextSize(size);
  if (this.visible) {
    this.disableMarker()
    this.enableMarker()
  }
}
Runner.prototype.getNameLabelLatLng = function(nowLocation) {
  var nowLocPoint = map.latLngToLayerPoint(nowLocation);
  return map.layerPointToLatLng(L.point(nowLocPoint.x,
    nowLocPoint.y - Runner.prototype.displayParam[this.displayOption][3]));
}

function setIconLabelTextSize(size) {
  var q = $(".iconLabel span");
  q.removeClass("small middle large")
  q.addClass(size);
}


function makeRunnerArray(r13, r2) {
  registerRunner(r13);
  registerRunner(r2);
};

function registerRunner(data) {
  var p = new Runner(data.id, data.name, data.team, data.color, data.order);
  runnerDictionary[runnerArray.length] = p.id;
  runnerArray.push(p);
  createClickEvent(data.id);
};

function createClickEvent(id) {
  $(('#' + id)).on('click', function() {
    var obj = getRunnerObjectFromId(id);
    if (this.checked) {
      obj.enableMarker();
      obj.visible = true;
    } else {
      obj.visible = false;
      obj.disableMarker();
    };
  });
};
