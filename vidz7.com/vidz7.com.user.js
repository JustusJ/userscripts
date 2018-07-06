// ==UserScript==
// @name        vidz7.com
// @namespace   vidz7.com
// @include     http://www.vidz7.com/*
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require     https://raw.githubusercontent.com/lodash/lodash/4.17.5/dist/lodash.min.js
// @version     3
// @grant       unsafeWindow
// ==/UserScript==

$(function () {

  var json = {};

  var headline = $("h1");
  var textarea = $("<textarea>");
  textarea.css({ width: "100%" });
  textarea.on("mouseenter", selectOnHover);
  headline.css({color: "yellow"});
  $(".widetitle").append(textarea);

  function display(json) {
    var json_string = JSON.stringify(json);
    textarea.val(json_string);
  }

  function receiveMessage(event) {
    if(event.data) {
      headline.css({color: "green"});
      var message = JSON.parse(event.data);
      if(message.deleted) { return; }
      console.log("message: ", message);
      json.duration = message.duration;
      json.videoUrls = [{ url: message.src, size: message.height }];
      if(message.fileSize) {
        var mbPerSecond = message.fileSize / (message.duration / 60);

        var infoText = headline.text() + ' (' + message.fileSize + ' MB, ' + Math.round(mbPerSecond) + ' MB/min)';
        headline.text(infoText);
      }

      display(json);
      textarea.select();
      document.title = "X" + document.title;
      } else {
      headline.css({color: "red"});
    }
  }

  unsafeWindow.addEventListener("message", receiveMessage, false);
  
  function selectOnHover(event) {
    event.target.focus();
    event.target.select();
  }

  function averageTitle() {
    // the site scambles the movie title (maybe to throw of copyright bots)
    // by changing 2 letters in the title. There are several places where the
    // title is in the HTML, all with different letters scrambled. Collect them
    // and build the title from the letters occuring most often in a given place
    var titles = [
      $("title").text().split("|")[1],
      $("[property='og:title']").attr("content").split("|")[1],
      $(".widetitle h1").text()
    ].map(function(t) {
      return {original: t, chars: $.trim(t).split("")}
    });
    var chars = titles.map(function(t) { return t.chars; })
    var x = _.zip.apply(_, chars).map(function(pairs) {
      var countedPairs = _.countBy(pairs);
      return _.maxBy(Object.keys(countedPairs), function(letter) {
        return countedPairs[letter];
      });
      
    })

    return x.join("");
  }

  

  function titleToSize(title) {
    return parseInt(title, 10);
  }

  var url = document.location.href;
  var poster = $("meta[property='og:image']").attr("content");
  var id = "vidz7.com-" + $("section.left-column article").attr("id").replace("post-id-", "");
  var title = averageTitle();
  var urls = $.makeArray($(".playerplace .dropmenu a")).map(function(link) {
    return {url: $(link).attr("href"), size: titleToSize($(link).text())};
  });
  var duration = 4;

  json["url"] = url;
  json["poster"] = poster;
  json["id"] = id;
  json["title"] = title;
  //json["videoUrls"] = urls;

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

  var relatedUrls = $.makeArray($("#relates-posts .thumb")).map(function(a) {
    return $(a).attr("href");
  });

  var relatedTextarea = $("<textarea>").val(relatedUrls.join("\n"))
  relatedTextarea.on("mouseenter", selectOnHover);
  $(".alert").append(relatedTextarea);

});
