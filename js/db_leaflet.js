var map;
var oMapImage;
var bgMapLayer;
var blankMapLayer;
var isAutoMapMovingMode = false

function init_db_leaflet() {
  init_map();
  setOMaps();
  setFunction();
}

function init_map() {
  //map setting
  map = L.map('map');
  map.setView([35.518988, 137.314703], 16);
  bgMapSrc = 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
  var gsiattr = "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>地理院タイル</a>";
  bgMapLayer = L.tileLayer(bgMapSrc, {
    attribution: gsiattr,
    maxZoom: 18,
    minZoom: 10
  })
  blankMapLayer = L.tileLayer("blank", {
    maxZoom: 18,
    minZoom: 10
  })
  map.addLayer(bgMapLayer);
  var sidebar = L.control.sidebar('sidebar').addTo(map);
}


var oMapImages
var selectedOMapImage

function setOMaps(initMapNum) {
  oMapImages = [
    setMapImage0(),
    setMapImage1(),
    setMapImage2(),
    setMapImage3()
  ]
  initMapNum = 1
  selectedOMapImage = oMapImages[initMapNum]
  selectedOMapImage.addTo(map)

}

function setMapImage0() {
  var oMapImageURL = "./src/icmr2018_pre_map.png"
  var topleft = L.latLng(35.524998682149913520, 137.30420995097315995);
  var topright = L.latLng(35.528397304149798686, 137.33580775076575264);
  var bottomleft = L.latLng(35.506792451156030666, 137.30712007154323828);
  var oMapImage = L.imageOverlay.rotated(oMapImageURL, topleft, topright, bottomleft, {
    opacity: 1,
    interactive: true
  })
  return oMapImage
}

function setMapImage1() { //mer
  var oMapImageURL = "./src/icmr2018_pre_map.png"
  var topleft = L.latLng(35.524889653328266093, 137.30319186769798989);
  var topright = L.latLng(35.528383519326503404, 137.33562229821268375);
  var bottomleft = L.latLng(35.506051867166263492, 137.30619803597716100);
  var oMapImage = L.imageOverlay.rotated(oMapImageURL, topleft, topright, bottomleft, {
    opacity: 1,
    interactive: true
  })
  return oMapImage
}

function setMapImage2() { //wer
  var oMapImageURL = "./src/icmr2018_pre_map.png"
  var topleft = L.latLng(35.524889653328266093, 137.30319186769798989);
  var topright = L.latLng(35.528383519326503404, 137.33562229821268375);
  var bottomleft = L.latLng(35.506051867166263492, 137.30619803597716100);
  var oMapImage = L.imageOverlay.rotated(oMapImageURL, topleft, topright, bottomleft, {
    opacity: 1,
    interactive: true
  })
  return oMapImage
}

function setMapImage3() { //or
  var oMapImageURL ="./src/icmr2018_pre_map.png"
  var topleft = L.latLng(35.524998682149913520, 137.30420995097315995);
  var topright = L.latLng(35.528397304149798686, 137.33580775076575264);
  var bottomleft = L.latLng(35.506792451156030666, 137.30712007154323828);
  var oMapImage = L.imageOverlay.rotated(oMapImageURL, topleft, topright, bottomleft, {
    opacity: 1,
    interactive: true
  })
  return oMapImage
}

function setFunction() {
  $(function() {
    $(("#" + ID_O_MAP_VISIBILITY)).change(function() {
      if (this.checked) {
        oMapImage.setOpacity(1);
      } else {
        oMapImage.setOpacity(0);
      }
    });
    $(("#" + ID_BG_MAP_VISIBILITY)).change(function() {
      if (this.checked) {
        map.removeLayer(blankMapLayer);
        map.addLayer(bgMapLayer);
      } else {
        map.removeLayer(bgMapLayer);
        map.addLayer(blankMapLayer);
      }
    });
    $('input[name="choose-omap-image-btn"]:radio').change(function() {
      var omap = this.value
      selectedOMapImage.removeFrom(map)
      switch (omap) {
        case "omap-mer":
          selectedOMapImage = oMapImages[1];
          break;
        case "omap-wer":
          selectedOMapImage = oMapImages[2];
          break;
        case "omap-or":
          selectedOMapImage = oMapImages[3];
          break;
        default:
      }
      selectedOMapImage.addTo(map)
    });
    $('input[name="runnerDisplayOptions"]:radio').change(function() {
      var size = this.value
      $.each(runnerArray, function() {
        this.setDisplaySize(size);
      })
    });

    //
  })
}
