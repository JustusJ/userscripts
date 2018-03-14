// ==UserScript==
// @name        vidz7.com
// @namespace   vidz7.com
// @include     http://www.vidz7.com/*
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// @version     2
// @grant       unsafeWindow
// ==/UserScript==

$(function () {

  var json = {};

  var textarea = $("<textarea>");
  textarea.css({ width: "100%" });
  textarea.on("mouseenter", selectOnHover);
  $(".widetitle").append(textarea);

  function display(json) {
    json_string = JSON.stringify(json);
    textarea.val(json_string);
  }

  function receiveMessage(event) {
    console.log("MESSAGE", arguments, event.data);
    json["duration"] = event.data;
    display(json);
  }

  unsafeWindow.addEventListener("message", receiveMessage, false);
  
  function selectOnHover(event) {
    event.target.focus();
    event.target.select();
  }

  var url = document.location.href;
  var poster = $("meta[property='og:image']").attr("content");
  var id = "vidz7.com-" + $("section.left-column article").attr("id").replace("post-id-", "");
  var title = $.trim($(".widetitle h1").text());
  var urls = $.makeArray($(".playerplace .dropmenu a")).map(function(link) {
    return {url: $(link).attr("href"), text: $.trim($(link).text())};
  });
  var duration = 4;

  json["url"] = url;
  json["poster"] = poster;
  json["id"] = id;
  json["title"] = title;
  json["videoUrls"] = urls;

  display(json);

  // show download links directly
  $(".playerplace .dropmenu a").removeAttr("target");
  //$(".hasmenu").replaceWith($(".dropmenu a"));
  $(".alert").append($(".dropmenu a"));

  // always show full title
  $(".widetitle").removeClass("widetitle").css({marginTop: "20px"});

  // dont waste so much vertical space
  $(".header").css({paddingTop: "0"});
  $("h1").css({fontSize: "18px"});
  $("section.site").css({padding: "0"});
  $(".topnav > ul > li a").css({lineHeight: "0"});
  
  // full width video
  $("section.left-column").css({width: "inherit", float: "none"});

  // move alert
  $(".alert").css({position: "absolute", top: "0", left: "0", width: "150px"});
});
