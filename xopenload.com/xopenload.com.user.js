// ==UserScript==
// @name         xopenload.com
// @namespace    xopenload.com
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://www.xopenload.com/xxx/*
// @match        http*://www.xopenload.com/embed.php*
// @grant        unsafeWindow
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// ==/UserScript==

(function () {
  'use strict';

  if (document.location.href.match(/\/xxx\//)) {
    video();
  }
  if (document.location.href.match(/\/embed\.php/)) {
    embed();
  }

  function video() {
    function selectOnHover(event) {
      event.target.focus();
      event.target.select();
    }

    function cleanup() {
    }

    var json = {};
    var sidebar = $(".sidebar");
    var headline = $("h1");
    var textarea = $("<textarea>");
    var info = $("<h1>");
    
    sidebar.empty();
    textarea.css({ width: "100%" });
    textarea.on("mouseenter", selectOnHover);
    headline.css({ color: "yellow" });
    sidebar.append(info);
    sidebar.append(textarea);

    function display(json) {
      var json_string = JSON.stringify(json);
      textarea.val(json_string);
    }

    function receiveMessage(event) {
      console.log(event);
      if (event.data) {
        var message = JSON.parse(event.data);
        if(message.deleted) { return; }
        console.log("message: ", message);
        info.css({ color: "green" });
        json.duration = message.duration;
        json.videoUrls = [{ url: message.src, size: message.height }];
        var infoText = "" + message.width + "x" + message.height;
        if(message.fileSize) {
          var mbPerSecond = message.fileSize / (message.duration / 60)
          infoText += ' (' + message.fileSize + ' MB, ' + Math.round(mbPerSecond) + ' MB/min)';
        }
        info.text(infoText);
        display(json);
        textarea.select();
        document.title = "X" + document.title;
      } else {
        info.css({ color: "red" });
      }
    }

    unsafeWindow.addEventListener("message", receiveMessage, false);

    var url = document.location.href;
    var poster = $("#images .g-item:first-child img").attr("src");
    var id = "xopenload.com-" + url.match(/\/xxx\/(\d+)\//)[1];
    var title = $.trim($(".data h1").text());

    json["url"] = url;
    json["poster"] = poster;
    json["id"] = id;
    json["title"] = title;
    
    display(json);
    cleanup();
  }

  function embed() {
    function cleanup() {
      $("#video_ads").remove();
      $("#closer").remove();
    }

    cleanup();
  }
})();