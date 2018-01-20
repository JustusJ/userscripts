// ==UserScript==
// @name        oload.stream
// @namespace   oload.stream
// @include     https://oload.stream/*
// @include     https://openload.co/*
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// @version  1
// @grant    none
// ==/UserScript==

// Set this to make the page think it got opened after doing the "switch to ad-page and open the vid in new tab" thing
unsafeWindow.ffopened = true;

$(function() {
  $("#videooverlay").click();
  var src = $("#olvideo_html5_api").attr("src");
  var $video = $("<video>").attr({"src": src, controls: true});
  $video.css({width: "100vw", height: "100vh"});
  var title = $(".file-details .other-title-bold").text();

  $("html").replaceWith("<div>");
  $("div").css({display: "flex", padding: 0, margin: 0, backgroundColor: "black"});
  $("div").append($video);
});
