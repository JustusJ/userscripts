// ==UserScript==
// @name         Scrape
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scrape content on different sites
// @author       You
// @match        https://tour.trueanal.com/*
// @match        https://tour.swallowed.com/videos*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.3.1.min.js

// ==/UserScript==

function parseHTML(data) {
  parser = new DOMParser();
  var doc = parser.parseFromString(data, "text/html");
  return $(doc);
}

// jQuery's 'when' returns the result of each promise as one argument.
// That is silly, so we create an array out of all arguments and rturn that.
function cleanWhenResult() {
  var pages = Array.prototype.slice.call(arguments);
  return pages;
}

function getPages(base, pageCount) {
  var requests = [];
  for (let i = 0; i < pageCount; i++) {
    url = base.replace("$$$", i + 1);
    var request = $.get(url).then(parseHTML);
    requests.push(request);
  }
  var result = [requests, $.when.apply($, requests).then(cleanWhenResult)];
  return result;
}

function showLoadingStatus(requests) {
  var $display = $("<div>").css({position: "fixed", top: 0, left: 0}).appendTo($("body"));
  requests.forEach(function(request) {
    var s = $("<span>").text("●").appendTo($display);
    request.then(_ => s.css({color: "green"}));
  });
}

function appendPorntrexLinks(scenes) {
  scenes.forEach(function (scene) {
    // var query = encodeURIComponent(safeTitle(scene.title));
    var query = encodeURIComponent(scene.actors.join(" "));
    var div = $("<div>");
    var url = "https://www.porntrex.com/search/" + query + "/";
    div.append($("<a>").text(scene.title).attr("href", url));
    $("body").append(div);
  });
}

function attr(attribute) {
  return element => $(element).attr(attribute);
}

function findArray(doc, selector) {
  return $.makeArray(doc.find(selector)).map(e => $(e));
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

(function () {
  'use strict';

  var url = document.location.href;
  if (url.indexOf("trueanal.com") !== -1) {
    scrapeTrueAnal();
  } else if (url.indexOf("swallowed.com") !== -1) {
    scrapeSwallowed();
  }
})();

function imagesFromUrl(url) {
  const result = []; 
  for (let i = 0; i < 6; i++) {
    result.push(url.replace(/\d\.jpg/, (i+1) + '.jpg'));
  }
  return result;
}

function scrapeSwallowed() {
  var pageCount = 13;
  var baseUrl = "https://tour.swallowed.com/videos?page=$$$";
  
  const [requests, allRequests] = getPages(baseUrl, pageCount);
  
  showLoadingStatus(requests);

  allRequests.then(function (pages) {
    var scenes = pages.map(function (page) {
      var scenes = findArray(page, ".content-item").map(function (scene) {
        var images = imagesFromUrl($(".thumbs-section a:first > img").attr("src"));
        return {
          title: $.trim(scene.find("h3.title").text()),
          actors: findArray(scene, "h4.models a").map(a => $.trim(a.text())),
          duration: $.trim(scene.find(".total-time").text()),
          releaseDate: $.trim(scene.find("time").text()),
          images: images
        }
      });
      return scenes;
    });
    scenes = flatten(scenes);
    console.log("scenes", flatten(scenes));

    safeTitle = t => t.replace("&", "and");

    var $textarea = $("<textarea>");
    $("body").append($textarea.text(JSON.stringify(scenes)));

    //appendPorntrexLinks(scenes);
  });
}

function scrapeTrueAnal() {
  var pageCount = 7;
  var baseUrl = "https://tour.trueanal.com/videos?page=$$$";
  const [requests, allRequests] = getPages(baseUrl, pageCount);
  
  showLoadingStatus(requests);

  allRequests.then(function (pages) {
  var scenes = pages.map(function (page) {
      var scenes = findArray(page, ".content-item-large").map(function (scene) {
        var images = imagesFromUrl($(".thumbs-section a:first > img").attr("src"));
        return {
          title: $.trim(scene.find("h3.title").text()),
          actors: findArray(scene, "h4.models a").map(a => $.trim(a.text())),
          duration: $.trim(scene.find(".total-time").text()),
          releaseDate: $.trim(scene.find(".date").text()),
          images: images
        }
      });
      return scenes;
    });
    scenes = flatten(scenes);
    console.log("scenes", flatten(scenes));

    safeTitle = t => t.replace("&", "and");

    var $textarea = $("<textarea>");
    $("body").append($textarea.text(JSON.stringify(scenes)));

    //appendPorntrexLinks(scenes);
  });
}