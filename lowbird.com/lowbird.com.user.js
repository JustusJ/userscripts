// ==UserScript==
// @name           lowbird_unfail
// @namespace      my.script.org
// @include        http*://www.lowbird.com*
// @include        http*://lowbird.com*
// @require		     https://code.jquery.com/jquery-3.2.1.slim.min.js
// @version        2
// ==/UserScript==

/* 
Thumbnail sizes
b0 = 192x288
b1 = 128x192
b2 = 128x96
b3 = 64x96
*/


console.log("Alive!2");

var IMGUR_ALBUM_URL = "http://api.imgur.com/2/account/albums/77Uqd.json";

// styles

var UserProfilePageStyle = {
	"#imageGrid div.image-container": {
		"display": "inline-block",
		"position": "relative",
		"width": "256px"
	},
	"#imageGrid div a.thumb": {
		"display": "inline-block"
	},
	"#imageGrid div.image-info": {
		"position": "relative",
		"display": "inline-block",
		"width": "50%",
		"height": "96px"
	},
	"#imageGrid div.image-info div": {
		"position": "relative"		
	},
	
	"#imageGrid div.image-info .score": {
		"margin-bottom": "4px"
	},
	
	"#imageGrid div.image-info .tags": {
		"height": "50px",
		"margin-bottom": "4px"
	},
	
	"#imageGrid div.image-info .comments": {
		
	},
	
	".imgur-images": {
		"margin": "12px 0 0 12px"
	},
	
	".imgur-images .imgur-container": {
		"width": "256px",
		"height": "90px",
		"display": "inline-block"
	},

	".imgur-images .imgur-container .image-container": {
		"height": "90px",
		"width": "90px",
		"overflow": "hidden",
		"display": "inline-block"
	},

	".imgur-images .acton-container": {
		"display": "inline-block",
		"height": "90px"
	}

}

function addStyle(style) {
	var s = $("<style>");
	s.attr({"type": "text/css", "custom": "true"});
	var styles = $.map(style, function(styleList, selector) {
		var pv = $.map(styleList, function(value, property) {
			return property + ": " + value + ";";
		});
		return selector + " {" + pv.join("") + "}";
	});
	s.text(styles.join("\n"));
	$("head").append(s);
}

// ===============================================

// Image View
loc = document.location.href;
divs = $("#imageGrid > div");
links = $("#imageGrid > div > a");
images = $("#imageGrid > div > a > img");
images_per_page = divs.length;
image_grid = $("#imageGrid");
image_grid.addClass("imageGrid");
images_div = $("#images");
width = image_grid.width();

if(loc.match(/all\/view/)) {
	// viewer = $("div#viewer");
	// things = $("div#viewer > div.center");
	// viewer.prepend(things);
}

// Images overview
if(loc.match(/lowbird\.com\/$/) || loc.match(/lowbird\.com\/all\/page/)) {
	image_width = 192;
	image_height = 288;
	div_class = "b0";
	images_per_row = Math.floor(width / image_width);
	image_grid.height(Math.ceil(images_per_page / images_per_row) * image_height);
	images_div.height(Math.ceil(images_per_page / images_per_row) * image_height);
	images_padding = (width % image_width) / 2;
	for (var i=0; i < images_per_page; i++) {
		div = $(divs[i]);
		image = $(images[i]);
		div.removeClass();
		div.addClass(div_class);
		div.css("left", i % images_per_row * image_width + images_padding + "px");
		div.css("top", Math.floor(i / images_per_row) * image_height + "px");
		new_src = image.attr("src").replace(/\d{2,3}x\d{2,3}/, image_width + "x" + image_height);
		image.attr("src", new_src);
	};
}

// ======================================================

function parseImagePage(text) {
	var dom = $(text);
	var result = {};
	var scoreVoteMatch;
	
	result.rating = $.trim(dom.find("#ratingDescription").text());
	result.tags = $.trim(dom.find("#tags").text());
	result.comments = dom.find(".comment");
	result.votes = null;
	result.score = null;
	scoreVoteMatch = result.rating.match(/(\d\.\d) after (\d+) Votes/);
	if(scoreVoteMatch) {
		result.score = Number(scoreVoteMatch[1]);
		result.votes = Number(scoreVoteMatch[2]);
	}
	return result;
}

function onImagePageLoad(context) {
	return function(response) {
		var imageInfo = parseImagePage(response.responseText);
		console.log("imageInfo", imageInfo);
		context["div"].data({comments: imageInfo.comments.length, score: imageInfo.score, votes: imageInfo.votes});
		
		context["score"].text(imageInfo.rating);
		context["tags"].text(imageInfo.tags);
		context["comments"].text(imageInfo.comments.length + " comment(s)");
		// var date = dom.find("#imageInfo .date");
	}
}

function userProfilePage() {
	addStyle(UserProfilePageStyle);
	var image_divs = $("#imageGrid > div");
	var new_src;
	var image_width = 128;
	var image_height = 96;
	
	var container = image_divs.map(function(i) {
		var div = $(this);
		var img = div.find("img");
		var link = div.find("a");
		var imageInfo = $("<div>").addClass("image-info");
		var score = $("<div>").addClass("score");
		var tags = $("<div>").addClass("tags");
		var comments = $("<div>").addClass("comments");
		var context = {div: div, img: img, link: link, imageInfo: imageInfo, score: score, tags: tags, comments: comments};
		
		// Clean up
		$("#images").removeAttr("style");
		$("#imageGrid").removeAttr("style");
		
		// Container div
		div.removeAttr("style");
		div.removeAttr("class");
		div.addClass("image-container");
		div.attr("id", "div" + i);
		
		// Image
		new_src = img.attr("src").replace(/\d{2,3}x\d{2,3}/, image_width + "x" + image_height);
		img.attr("src", new_src);
		
		// Image Info
		score.text("---");
		imageInfo.append(score);
		
		tags.text("---");
		imageInfo.append(tags);
		
		comments.text("---");
		imageInfo.append(comments);
		
		div.append(imageInfo);

		GM_xmlhttpRequest({method: "GET", url: link.attr("href"), onload: onImagePageLoad(context)});
		
		return context;
	});
	
	userProfileImgurImages();
}

function userProfileImgurImages() {
	var $container = $("<div>").attr("class", "imgur-images");
	var $form = $("<form>").attr({"method": "POST", "enctype": "multipart/form-data", "action": "/upload"});
	var $urlInput = $("<input>").attr({"type": "text", "name": "url"});
	var $images = $("#images");
	
	var upload = function(url) {
		$urlInput.val(url);
		$form.submit();
	}

	var onImgurAlbumLoad = function(context) {
		return function (response) {
			var albums = JSON.parse(response.responseText);
			$(albums.albums).each(function(i) {
				var $img, $div, $a, $imageContainer, $actionContainer, $upload;
				this["image"]["links"] = this["links"];
				$div = $("<div>").addClass("imgur-container");
				$imageContainer = $("<div>").addClass("image-container");
				$a = $("<a>").attr({"href": this["links"]["original"], "target": "_blank"});
				$img = $("<img>").attr("src", this["links"]["small_square"]);

				$actionContainer = $("<div>").addClass("acton-container");
				$upload = $("<a>").addClass("upload-link").data("url", this["links"]["original"]).attr("href", "javascript:void(0)").text("upload");
				$actionContainer.append($upload);

				$div.append($imageContainer);
				$div.append($actionContainer);
				$imageContainer.append($a);
				$a.append($img);
				context.append($div);
			});
		}
	}
	
	$container.on("click", ".upload-link", function() {
		upload($(this).data("url"));
	});
	
	GM_xmlhttpRequest({method: "GET", url: IMGUR_ALBUM_URL, onload: onImgurAlbumLoad($container)});

	$images.append($container);
	$form.append($urlInput);
	$("body").append($form);
}

function cleanupImageView() {
	document.title = "";
	$("center").remove();
	$("div.center").slice(1).remove();
	$("#viewer br").remove();
	$("#logo").remove();
	$("#menu").css({"height": "28px"});
	$("#menu div").css({"margin-top": "4px"});
	$(".userInfo").insertAfter("#viewer");
}

function sort() {
	var imageDivs = $("#imageGrid > div");
	imageDivs = imageDivs.sort(function(a, b) {
		return $(b).data("votes") - $(a).data("votes");
	});
	var imageGrid = $("#imageGrid");
	
	imageGrid.text("");
	imageGrid.append(imageDivs);
}
unsafeWindow["sort"] = sort;

if(loc.match(/lowbird\.com\/user\//)) {
	userProfilePage();
}

if(loc.match(/\/view\//)) {
	cleanupImageView();
}













// consumer key: 8f7993ed4d2cc96715714ecf434b5d9c04fea07fd
// consumer secret: 2c22b47d398c77c7b5b6f9e7b2654d68






