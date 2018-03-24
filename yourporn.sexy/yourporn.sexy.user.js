// ==UserScript==
// @name         yourporn.sexy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yourporn.sexy/post/*
// @match         https://yourporn.sexy/*
// @grant        unsafeWindow
// ==/UserScript==


$(function() {
  function inDiv(text) {
      return $("<div>").append(text);
  }

  function selectOnHover(event) {
      event.target.focus();
      event.target.select();
  }

  var VALID_SIZES = [360, 480, 720, 1080];

  function heightToSize(height) {
    var diffs = VALID_SIZES.map(function(s) { return Math.abs(s - height) });
    var minDiff = Math.min.apply(Math, diffs);
    return VALID_SIZES[diffs.indexOf(minDiff)];
  }

  function onVideoLoaded(video) {
      var resolution = "" + video.videoWidth + "x" + video.videoHeight;
      var info = {
          id: "yourporn.sexy-" + document.location.href.match(/post\/([^.]+)/)[1],
          videoUrls: [{
            url: video.src,
            size: heightToSize(video.videoHeight)
          }],
          url: document.location.href,
          title: $("#posts_container .post_text").text().replace(/[^-\da-z,.']+/ig, " "),
          poster: video.poster,
          duration: Math.round(video.duration)
      };
      div.empty();
      div.append(inDiv(resolution));
      var updateUrl = "http://localhost:3000/videos/update_from_json?json=" + encodeURIComponent(JSON.stringify(info))
      div.append(inDiv($("<a>").attr("href", updateUrl).text("http://localhost:3000/videos/update_from_json")));
      var textarea = $("<textarea>").val(JSON.stringify(info));
      textarea.css({width: "100%"});
      textarea.on("mouseenter", selectOnHover);
      div.append(textarea);
      div.append(inDiv(JSON.stringify(info)).css({fontSize: "10px"}).on("mouseenter", selectOnHover));
  }

  var $video = $("video");
  var video = $video.get(0);
  if(video) {
      var div = $("<div>").css({color: "tan", fontSize: "14px"}).text("--x--");
      $("#h5vwrapper_player_el").prepend(div);
      var fn = onVideoLoaded.bind(null, video);
      if(video.readyState != 4) {
          $video.on("loadeddata", fn);
      } else {
          onVideoLoaded(video);
      }
  }
});

function onImageLoad() {
  var image = $(this);
  var title = image.parents(".post_block").find(".span_author_name span");
  title.text("" + this.naturalWidth + "x" + this.naturalHeight);
}

$(function() {
  $("img.mini_post_vid_thumb").map(function() {
      if(this.complete) {
          onImageLoad.apply(this);
      } else {
          $(this).on("load", onImageLoad);
      }
  });
});
