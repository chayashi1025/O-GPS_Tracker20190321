/**********************************************************************/
/*  init*/
/**********************************************************************/
var timer;
const AJAX_INTERBAL = 5000;
const DEMO_TIMER_INTERVAL = 5000;
//var file = fs.CreateTextFile("text.txt");

function init_k1_createTimer() {
  getAllPastDataAndPlot();
  timer = setInterval(getAndPlotGPSLog, AJAX_INTERBAL, false)
  //timer = setInterval(letRunnersToStartRandomwalk,DEMO_TIMER_INTERVAL,false)
}
/**********************************************************************/
/*  get gps log from server while the game*/
/**********************************************************************/

function getAndPlotGPSLog() {
  var jsonFilePath = "http://gazyumaru.com/test.json";
  $.ajax({
      url: jsonFilePath,
      dataType: "json",
      cache: false
    })
    .then(
      function(data) {
        registerLatLngsToRunner(data);
        //console.log("getAndPlotGPSLog:" + [Date.now(),data])
      },
      function() {
        printError("Coudn't get JSON:getAndPlotGPSLog")
      })
}
/**********************************************************************/
/* get past gps log from server */
/**********************************************************************/

function getAllPastDataAndPlot(){
  var jsonFilePath = "http://gazyumaru.com/data.json"
  $.ajax({
      url: jsonFilePath,
      dataType: "json",
      cache: false
    })
    .then(
      function(data) {
        console.log("start----set past data----")
        console.log("getAllPastDataAndPlot:" + [Date.now(),data])
        registerLatLngsToRunner(data);
          console.log("finish-----set past data----")

      },
      function() {
        printError("Coudn't get JSON:getAllPastDataAndPlot")
      })

}

function registerLatLngsToRunner(gpsLogs) {
  //console.log(gpsLogs)
  for (var i = 0; i < gpsLogs.length; i++) {
    var log = gpsLogs[i];
    var idx = getRunnerIndexFromId(log.id);
    if (idx != -1) {
      var p = runnerArray[idx];
      console.log([Date.now(),log.lat, log.lng,log.time,log.id])
      p.updateOrbit([Number(log.lat), Number(log.lng)],log.time);
    }
  };
  if (isAutoMapMovingMode){
    getCenterLatLngForAutoMapMoving()
  }
};
function getCenterLatLngForAutoMapMoving(){
  var cnt = 0;
  var lats = 0;
  var lngs = 0;
  runnerArray.forEach(function(r){
    if (r.visible){
      latestLatLng = r.location[r.location.length - 1]
      lats += Number(latestLatLng[0])
      lngs += Number(latestLatLng[1])
      cnt += Number(1)
    }
  })
  if(cnt!=0){
    var centerLatLng = [lats/cnt,lngs/cnt];
    //console.log(centerLatLng)
    map.setView(centerLatLng);
  }
}
/**********************************************************************/
/*  Random Walk 2*/
/**********************************************************************/
function letRunnersToStartRandomwalk() {
  var gpsLog = null;
  runnerArray.forEach(function(runner) {
    runner.updateOrbit(getRandomLatLng(runner.location),Date.now());
  });
  if (isAutoMapMovingMode){
    getCenterLatLngForAutoMapMoving()
  }
}

function getRandomLatLng(latLngs) {

  var rmd_lat, rmd_lng;
  rmd_lat = Math.random();
  rmd_lng = Math.random();

  var mapBounds = map.getBounds()
  var a0 = mapBounds._northEast.lat;
  var o0 = mapBounds._northEast.lng;
  var a1 = mapBounds._southWest.lat;
  var o1 = mapBounds._southWest.lng;

  var loc_lat, loc_lng;
  if (latLngs.length != 0) {
    var latestLatlng = latLngs[latLngs.length - 1];
    var center_lat, center_lng;
    magnification = 0.04;
    rmd_lat = (rmd_lat - 0.5) * magnification
    rmd_lng = (rmd_lng - 0.5) * magnification
    loc_lat = latestLatlng[0] + rmd_lat * (a1 - a0);
    loc_lng = latestLatlng[1] + rmd_lng * (o1 - o0);

    if (loc_lat >= a0) loc_lat = a0 + .1 * (a1 - a0);
    if (loc_lat <= a1) loc_lat = a0 + .9 * (a1 - a0);
    if (loc_lng >= o0) loc_lng = o0 + .1 * (o1 - o0);
    if (loc_lng <= o1) loc_lng = o0 + .9 * (o1 - o0);
  } else {
    loc_lat = a0 + rmd_lat * (a1 - a0);
    loc_lng = o0 + rmd_lng * (o1 - o0);
  }

  return [loc_lat, loc_lng];
}
