
'use strict';

var firebase = firebase.database().ref("comments");
function init_k1_createTimer_20190112(){
  firebase.on("child_added",getLogFromFirebase);
}
var con = 0
function getLogFromFirebase(snapshot){
  //ここで受け取ったデータ
  var gpsLog = snapshot.val();
  var devideId = gpsLog.number;
  var latLng = [gpsLog.latitude,gpsLog.longitude]
  con = con+1;
  console.log("getLogFromFirebase:",con,":",gpsLog);
．
  var runner = runnerArray[0];
  runner.updateOrbit(latLng);
  if(runner.visible){
    runner.updateView();
  }
}
