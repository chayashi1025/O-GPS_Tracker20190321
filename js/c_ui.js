/********************************************************************
 *
 * User Interface
 *
 *********************************************************************/
var ID_BG_MAP_VISIBILITY = "bg-map-visibility";
var ID_O_MAP_VISIBILITY = "o-map-visibility";
var ID_START_GPS_TRACKING = "start-gps-tracking";
var ID_CHOOSE_RUNNER_DISPLAY_MODE = "choose-runner-display-mode"
var ID_CHOOSE_OMAP_IMAGE = "choose-omap-image"

function init_c_ui() {
  inputContentIntoSettingContents(createTagOfChooseOMapImage());
  inputContentIntoSettingContents(createTagOfSelectBackgroundMap());
  inputContentIntoSettingContents(createTagOfSetAutoMapMovingMode());
  //inputContentIntoSettingContents(createTagOfOMapVisibleOption());
  inputContentIntoSettingContents(createTagOfSlideBarForRunnerOrbitAdjustment());
  inputContentIntoSettingContents(createTagOfChooseRunnerDisplayMode());
  //inputContentIntoSettingContents(createTagOfChooseApplicationMode());
  //clickAllRunner();
}

function inputContentIntoSettingContents(content) {
  $("#settings-contents").append('<hr width="100%">').append(content);
}

function createTagOfOMapVisibleOption() {
  var id = ID_O_MAP_VISIBILITY
  var content = $("<label>").attr("for", id)
  var chkbox = $("<input>").attr("type", "checkbox").attr("id", id).attr("class", "my-checkbox").prop("checked", true);
  var span = createTagOfOptionName("O-map visiblility: ", "").addClass("option-chkbox-icon")
  content.append(chkbox).append(span);
  return content
}

function createTagOfSelectBackgroundMap() {
  var id = ID_BG_MAP_VISIBILITY
  var content = $("<label>").attr("for", id)
  var chkbox = $("<input>").attr("type", "checkbox").attr("id", id).attr("class", "my-checkbox").prop("checked",true)
  var span = createTagOfOptionName("Background map visiblility: ", "").addClass("option-chkbox-icon")
  var span = createTagOfOptionName("背景地図の表示: ", "").addClass("option-chkbox-icon")

  content.append(chkbox).append(span);
  return content
}

function createTagOfChooseOMapImage(){
  var id = ID_CHOOSE_OMAP_IMAGE
  var buttonName = "choose-omap-image-btn"
  var content = $("<div>").attr("id", id)
  var contentLabel = createTagOfOptionName("O-Mapクラス:","");

  var radioButtonContent = $("<div>").addClass("container");
  var merMode = createTagOfRadioButton("omap-mer", "MER", buttonName, "omap-mer", true);
  var werMode = createTagOfRadioButton("omap-wer", "WER", buttonName, "omap-wer", false);
  var orMode = createTagOfRadioButton("omap-or", "OR", buttonName, "omap-or", false);

  return content.append(contentLabel).append(radioButtonContent.append(merMode).append(werMode).append(orMode));

}

function createTagOfStartGpsTrackingOption() {
  var content = $("<label>");
  content.attr("for", ID_START_GPS_TRACKING)
  var chkbox = $("<input>");
  chkbox.attr("type", "checkbox").attr("id", ID_START_GPS_TRACKING);
  content.append(chkbox);
  content.append("Start GPS Tracking");
  return content
}

function createTagOfSlideBarForRunnerOrbitAdjustment() {
  var max = MAX_ORBIT_LENGTH
  var min = 12
  var step = 12
  var id = "runner-orbit-length-slider"
  var defaultLength = (max+min)/2
  var content = $("<div>");
  var text = createTagOfOptionName("軌跡の長さ:  " + defaultLength / step + "分", "</br>").attr("id", "orbit-length-text")
  var text = createTagOfOptionName("軌跡長（12 <-> 720steps）", "</br>").attr("id", "orbit-length-text")

  var slider = $("<input>")
    .attr("id", id).attr("class", "slider").attr("type", "range")
    .attr("value", defaultLength).attr("min", min).attr("max", max).attr("step", step);
  $(function() {
    $(("#" + id)).change(function() {
      var val = slider.val();
      var valForDisplay = slider.val() / step + "分"
      var currentVal = Runner.prototype.visibleOrbitLength
      if (val != currentVal) {
        console.log(currentVal + "->" + val);
        Runner.prototype.setVisibleOrbitLength(val);
        //$("#orbit-length-text").html("Runner's orbit length:  " + valForDisplay + "<br/>");
        //$("#orbit-length-text").html("軌跡の長さ:  " + valForDisplay + "<br/>");
      }
    });
  })
  content.append(text).append(slider)
  return content
}

function createTagOfChooseRunnerDisplayMode() {
  var id = ID_CHOOSE_RUNNER_DISPLAY_MODE
  var buttonName = "runnerDisplayOptions"
  var content = $("<div>").attr("id", id)
  var contentLabel = createTagOfOptionName("マーカーの大きさ:","");

  var radioButtonContent = $("<div>").addClass("container");
  var smallMode = createTagOfRadioButton("display-op-small", "Small", buttonName, "small", false);
  var middleMode = createTagOfRadioButton("display-op-middle", "Middle", buttonName, "middle", true);
  var largeMode = createTagOfRadioButton("display-op-large", "Large", buttonName, "large", false);

  return content.append(contentLabel).append(radioButtonContent.append(smallMode).append(middleMode).append(largeMode));
}
function createTagOfSetAutoMapMovingMode(){
  var id = "auto-map-moving"
  var content = $("<label>").attr("for", id)
  var chkbox = $("<input>").attr("type", "checkbox").attr("id", id).attr("class", "my-checkbox").prop("checked", isAutoMapMovingMode);
  var span = createTagOfOptionName("Auto map moving mode: ", "").addClass("option-chkbox-icon")
  var span = createTagOfOptionName("表示位置の自動移動: ", "").addClass("option-chkbox-icon")
  content.append(chkbox).append(span);

  $(function() {
    $(("#" + id)).change(function() {
      isAutoMapMovingMode = this.checked;
    });
  })

  return content
}

function createTagOfChooseApplicationMode() {
  var id = "choose-app-mode"
  var content = $("<div>").attr("id", id);
  var contentLabel = createTagOfOptionName("<s>Application mode:</s>", "</br>")
  var liveMode = createTagOfRadioButton("live-mode", "Live Mode", id,"a", true);
  var replayMode = createTagOfRadioButton("replay-mode", "Replay Mode(Under Construction)", id,"b", false);
  return content.append(contentLabel).append(liveMode).append(replayMode);
}

function createTagOfRadioButton(id, text, buttonName, value, checked) {
  var div = $("<div>").addClass("row")
  var label = $('<label>');
  var span = $("<span>").html(text)
  var input = $("<input>").attr("type", "radio")
  .attr("name", buttonName).attr("id", id).attr("value", value)
  .prop("checked", checked);
  return div.append(label.append(input).append(span))
}

function createTagOfOptionName(text, suffix) {
  return $("<span>").attr("class", "option-title").html(text + suffix)
}



////////////////////////////////////////////////////
// runner selection option
////////////////////////////////////////////////////
const ORDER_1ST = 'order-1';
const ORDER_2ND = 'order-2';

function makeRunnerListHTML(r13, r2) {
  var textId = [r13.id, r2.id];
  var textName = [r13.name, r2.name];
  var textTeam = r13.team;
  var textColor = r13.color

  var tbody = $('#runnerListRecord');
  var tr = $('<tr>');
  var textLabel = createTdForTeamLabel(textTeam, textColor);
  var chkbox1 = createTdElementOfRunnerList(textName[0], textId[0], ORDER_1ST);
  var chkbox2 = createTdElementOfRunnerList(textName[1], textId[1], ORDER_2ND);
  tr.append(textLabel).append(chkbox1).append(chkbox2);
  tbody.append(tr);
};

function createTdForTeamLabel(team, color) {
  var icon = $('<span>').attr('class', 'teamIcon').css('background-color', color);
  var textLabel = $('<td>');
  textLabel.prepend(icon.html("<b>" + team + "</b>"));
  return textLabel;
};

function createTdElementOfRunnerList(name, id, order) {

  var label = $('<label>').attr('for', id);
  var span = $('<span>').attr('class', 'checkbox-icon').html("  " + name);
  var input = $('<input>');
  var isVisible = false;

  input.attr('type', 'checkbox').attr('id', id).attr('class', order + ' ' + 'my-checkbox').prop("checked",isVisible);
  var div = $('<div>').attr('class', 'runner');

  label.append(input).append(span);
  return $('<td>').append(div.append(label));
};

function clickAllRunner(){
  $("#selectAll1").click();
  $("#"+"selectAll2").click();
}

function createRunnerGroupSelector() {
  var id1 = 'selectAll1';
  var id2 = 'selectAll2';

  var tbody = $('#runnerListRecord');
  var tr = $('<tr>');
  var textLabel = $('<td>').html('<b>Select All</b>');

  var col1 = createTdElementOfRunnerList('<b>All</b>', id1, ORDER_1ST);
  var col2 = createTdElementOfRunnerList('<b>All</b>', id2, ORDER_2ND);
  tr.append(textLabel).append(col1).append(col2);
  tbody.prepend(tr);

  $(('#' + id1)).on('click', null, {
    order: ORDER_1ST
  }, allSelectChkBoxClicked);
  $(('#' + id2)).on('click', null, {
    order: ORDER_2ND
  }, allSelectChkBoxClicked);
};

function allSelectChkBoxClicked(e) {
  var target = $('.' + e.data.order);
  if (this.checked) {
    target.each(function(i, ele) {
      if (!ele.checked) {
        ele.click();
      }
    });
  } else {
    target.each(function(i, ele) {
      if (ele.checked) {
        ele.click();
      }
    });
  };
};


/*************************************************************/
//util
/*************************************************************/

function getRunnerIndexFromId(id) {
  return runnerDictionary.indexOf(id);
};

function getRunnerObjectFromId(id) {
  return runnerArray[runnerDictionary.indexOf(id)];
};

function printError(text) {
  console.log("ERROR:" + text + "| time:" + Date.now());
}
