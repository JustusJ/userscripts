// ==UserScript==
// @name         spankbang.com
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       You
// @match        https://*.spankbang.com/*/video/*
// @match        https://spankbang.com/*/video/*
// @grant        none
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// ==/UserScript==

(function() {
  'use strict';

  function buildUrls(urls) {
    return urls.filter(function(url) {
      return url.url && url.url.match(/^https/);
    });
  }

  function selectOnHover(event) {
      event.target.focus();
      event.target.select();
  }

  function cleanup() {
    $(".user_panel_guest").remove();
    $(".ttaa").remove();
    $("#container .right").empty();
    $("#container .right").append($("#video .toolbar .right_set"));

    $("<style>").attr("rel", "stylesheet").text(".right_set .active {font-weight: bold;}").appendTo("body")
  }

  cleanup();

  var video = $("#video_player");

  var url = document.location.href;
  var images = $.makeArray($(".timeline .thumbnails img")).map(function(img) {
    return "https:" + $(img).attr("src");
  });
  var poster = "https:" + video.attr("poster");
  var id = "spankbang.com-" + window.stream_id;
  var title = $.trim($(".info h1").text());

  var urls = buildUrls([
    {url: window.stream_url_480p, size: 480}, {url: window.stream_url_720p, size: 720}, {url: window.stream_url_1080p, size: 1080}, {url: window.stream_url_4k, size: 4096}
  ]);
  var duration = $.trim($(".details .right_side span").text());

  var json = JSON.stringify({
      url: url, poster: poster, id: id, title: title, videoUrls: urls, duration: duration
  });

  var textarea = $("<textarea>").val(json);
  textarea.css({width: "100%"});
  textarea.on("mouseenter", selectOnHover);

  $("#video_container").prepend(textarea);
})();