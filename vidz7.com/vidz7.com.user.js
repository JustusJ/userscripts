// ==UserScript==
// @name        vidz7.com
// @namespace   vidz7.com
// @include     http://www.vidz7.com/*
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// @version  1
// @grant    none
// ==/UserScript==

$(function() {
	$(".playerplace .dropmenu a").removeAttr("target");
  $(".hasmenu").replaceWith($(".dropmenu a"));
})
