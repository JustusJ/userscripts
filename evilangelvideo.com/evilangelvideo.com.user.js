// ==UserScript==
// @name        evilangelvideo.com
// @namespace   evilangelvideo.com
// @include     http://www.evilangelvideo.com/video/*
// @version     1
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// @grant       none
// ==/UserScript==

Array.prototype.flatMap = function(lambda) { 
    return Array.prototype.concat.apply([], this.map(lambda)); 
};

function toLowerCase(s){ return s.toLowerCase(); }

function singleLetterLastname(name) { return name.match(/\s\w$/) }

function onlyFirstname(name) { return name.split(" ")[0] }

(function() {
  var $ = jQuery.noConflict();

  $(".actors strong").remove();
  var sceneActors = $.makeArray($(".actors").remove("strong")).flatMap(function(e) { return $(e).text().split(",") }).map($.trim).map(toLowerCase);
  var firstnamesOfSingleLetterLastnames = sceneActors.filter(singleLetterLastname).map(onlyFirstname);
  
  sceneActors += firstnamesOfSingleLetterLastnames;
  
  console.log(sceneActors)
  
  var ul = $(".details ul");
  var li = $(".details ul li:nth-child(4)").clone();
  ul.append(li);
  var actors = li.find("a");
  console.log(actors);
  
  $.makeArray(actors).forEach(function(a) {
  	var name = $(a).text().toLowerCase();
    if(sceneActors.indexOf(name) !== -1) {
    	$(a).remove()
    }
  })
  
})();
