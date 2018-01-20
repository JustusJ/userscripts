// ==UserScript==
// @name        google image links
// @namespace   google.de
// @include     http*://www.google.*/*
// @require			https://code.jquery.com/jquery-3.2.1.slim.min.js
// @version     1
// ==/UserScript==


function rewriteLinks() {
  $("body").on("mouseenter", "#isr_mc a.rg_l", function(event) {
  	var a = $(this);
    var m = a.attr("href").match(/[&?]imgurl=(.*?)&/);
    if(m) {
      a.attr("href", decodeURIComponent(m[1]));
    }
  });
}

$(function() {

  if(document.location.href.indexOf("tbm=isch") != -1) {
    rewriteLinks();
	}
  
});
