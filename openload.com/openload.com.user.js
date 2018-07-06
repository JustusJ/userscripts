// ==UserScript==
// @name        openload.com
// @namespace   openload.com
// @include     https://oload.stream/*
// @include     https://openload.co/*
// @include     https://oload.xyz/*
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// @version     4
// @grant       unsafeWindow
// ==/UserScript==

// Set this to make the page think it got opened after doing the 
// "switch to ad-page and open the vid in new tab" thing
unsafeWindow.ffopened = true;

$(function() {
  var fileSize;
  if(!unsafeWindow.fileid) {
    var message = {deleted: true};
    unsafeWindow.top.postMessage(JSON.stringify(message), "*");
    return;
  }

  var video = $("<video>"); 
  video.on("loadedmetadata", function(event) {
    console.log(event)
    var duration = parseInt(video.get(0).duration, 10);
    var width = parseInt(video.get(0).videoWidth, 10);
    var height = parseInt(video.get(0).videoHeight, 10);
    var src = video.prop("src");
    var message = {
      duration: duration,
      width: width,
      height: height,
      src: src,
      fileSize: fileSize
    };
    unsafeWindow.top.postMessage(JSON.stringify(message), "*");
    if(fileSize) {
      var mbPerMinute = fileSize / (duration / 60);
      infoText = '' + message.fileSize + ' MB, ' + Math.round(mbPerMinute) + ' MB/min';
      unsafeWindow.document.title = infoText;
    }
  });

  var m = $('.file-details .content-text').text().match(/(\d+(?:\.\d+)?)\s*([MG]B)/);
  console.log('match: ', m, $('.file-details .content-text').text() + "1");
  if(m) {
    var n = parseInt(m[1], 10);
    if(m[2] === 'GB') {
      n = n * 1024;
    }
    fileSize = n;
  }
  $("#videooverlay").click();
  var src = $("#olvideo_html5_api").attr("src");
  console.log(unsafeWindow.location.href)
  if(unsafeWindow.location.href.indexOf('embed') !== -1) {
    unsafeWindow.location.href = unsafeWindow.location.href.replace('embed', 'f');
  }
  var $video = video.attr({"src": src, controls: true});
  $video.css({width: "100vw", height: "100vh"});
  var title = $(".file-details .other-title-bold").text();

  $("html").replaceWith($("<div>"));
  $("div").replaceWith($("<html>"));
  $("html").append($('<head>')).append($('<body>'));
  //$("html").replaceWith("<div>");
  $("body").css({display: "flex", padding: 0, margin: 0, backgroundColor: "black"});
  $("body").append($video);
});