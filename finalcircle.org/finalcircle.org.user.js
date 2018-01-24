// ==UserScript==
// @name        final
// @namespace   final.org
// @description final.org
// @include     http://www.finalcircle.org/Exclusive/index.php?/topic/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==



a = document.querySelectorAll(".post_body .post a")

a.forEach(function(b) {
  c = b.getAttribute("href")
  b.innerHTML = c;
})


var posts = $($(".general_box")[0]);
var fr = $("#fast_reply");
posts.after(fr);

var text = $.trim($(".post_block").slice(1,2).find(".post.entry-content").text());
$("#fast-reply_textarea").val(text);

var container = $("<div>");

function submit() {
	$("#submit_post").click();
}

function countdown(t) {
	setInterval(function() {
		t = t - 1;
		container.text(t);
	}, 1000);
}

function setWait(n) {
	return function() {
		var wait = n * 1000 * 120 + 3;
		container.empty();
		countdown(n * 120 + 3);
		setTimeout(submit, wait);
	}
}

for (var i = 1; i <= 10; i++) {
	var l = $("<a>").text(i * 2).attr("href", "javascript:void(0)").css({marginLeft: "8px"}).click(setWait(i));
	container.append(l);
};

$(".submit").append(container);