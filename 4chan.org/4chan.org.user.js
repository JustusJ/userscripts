// ==UserScript==
// @name        4chan.org
// @namespace   org.4chan
// @include     *4chan.org*
// @version     1
// @require     http://code.jquery.com/jquery-1.9.1.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// ==/UserScript==
// @resource css http://userscripts.org/stylesheets/compiled/screen.css    

(function () {
	return;
	// prevent 4chan page from adding eventlisteners on threads
	var oldDollar = unsafeWindow.$.on;
	console.log(unsafeWindow.$.on);
	unsafeWindow.$.on = function (a, b, c) {
		if (a.id !== "threads") {
			oldDollar.apply(this, [a, b, c]);
		} else {
			console.log("prevented 4chan from adding eventlistenrer: ", this, arguments);
		}
	}
})();

function logCall(fn, title) {
	return function () {
		title ? console.log(title, arguments, this) : console.log(arguments, this);
		fn.apply(this, arguments);
	}
}
/*
var style = $("<style>").attr({
	"rel": "stylesheet",
	"type": "text/css"
}).text(GM_getResourceText("css"));
$("body").append(style);
*/
function UrlMatcher() {
	this.matchers = {};
}

UrlMatcher.prototype = {

	add: function (regexp) {
		var callbacks = Array.prototype.slice.call(arguments, 1);
		this.matcher(regexp).callbacks = this.matcher(regexp).callbacks.concat(callbacks);
	},

	matcher: function (regexp) {
		var key = regexp.toString();
		if (!this.matchers[key]) {
			this.matchers[key] = {
				pattern: regexp,
				callbacks: []
			};
		}
		return this.matchers[key];
	},

	run: function (location) {
		for (var m in this.matchers) {
			var v = this.matchers[m.toString()];
			if (location.match(v.pattern)) {
				for (var i in v.callbacks) {
					v.callbacks[i].call();
				}
			}
		}
	}
}

function cleanup() {
	$(".boardBanner img").remove();
	$(".topad.center").remove();
	$(".ad-plea").remove();
	$(".middlead.center").remove();
	$("hr").remove();
	$("").remove();
	$("").remove();
	$("").remove();
}

function replaceLinks() {
	$("#boards a").each(function () {
		var e = $(this);
		e.attr("href", e.attr("href") + "/catalog");
	});
}

function onThreadLinkClick(event) {
	if (event.ctrlKey) {
		var thread = $(this).parent('.thread');
		var id = threadIdForThread(thread);
		toggleHidden(id);
		event.preventDefault();
	} else if (event.shiftKey) {
		var thread = $(this).parent('.thread');
		var id = threadIdForThread(thread);
		toggleHidden(id);
		var url = $(this).prop("href").replace(/^https/, "http");
		appendThreadURL(url);
		event.preventDefault();
	}
}

function onCatalogLoaded() {
	loadThreadsFromUrl();
	$("#threads").on('click', '.thread > a', onThreadLinkClick);
	$(".thread").each(function () {
		var thread = $(this);
		var id = threadIdForThread(thread);
		var gmKey = threadKey(id);
		setTimeout(function () {
			setThreadVisibility(id, GM_getValue(gmKey, true));
		}, 0);
		appendToolbar(thread);
		appendThreadInfoBar(thread);
	});
}

function appendThreadInfoBar(thread) {
	var meta = thread.find(".meta");
	var thumb = thread.find('.thumb');
	var thumbHeight = thumb.height();
	var heightDiff = 150 - thumbHeight;

	var infoText = meta.text();
	// "R: 1", "", "R: 39 / I: 14"
	var m = infoText.match(/R: (\d+) \/ I: (\d+)/);
	var imageCount = m ? parseInt(m[2], 10) : 0;
	var angle = Math.min((imageCount / 20) * 120, 120);
	meta.css({
		backgroundColor: 'hsl(' + angle + ', 100%, 50%)',
		color: 'black',
		fontSize: '1em',
		padding: '2px 0px',
		fontWeight: 'bold',
		margin: '0px 4px',
	});
	meta.text(imageCount);
}

function appendToolbar(thread) {
	var container = $("<div>").addClass("threadToolbar");
	
	var hide = $("<a>").text("hide").addClass("hide").attr({
		"href": "javascript:void(0)"
	});
	hide.click(function () {
		var thread = $(this).parents('.thread');
		var id = threadIdForThread(thread);
		setHidden(id);
	});
	
	var save = $("<a>").text("save").addClass("save").attr({
		"href": "javascript:void(0)"
	});
	save.click(function () {
		var thread = $(this).parents('.thread');
		var id = threadIdForThread(thread);
		setHidden(id);
		var url = thread.find("> a").prop("href").replace(/^https/, "http");
		appendThreadURL(url);
		//saveOnFchanarchive(url);
		console.log(thread, id, url)
	});
	
	container.append(hide).append(save);
	container.insertBefore(thread.find("a"));
}

function saveOnFchanarchive(url) {
	console.log("saveOnFchanarchive: " + url);
	var warn = function(response) { warnNotSaved(response, url) };
	try {
		GM_xmlhttpRequest({
			url: "http://fchanarchive.roflzomfg.de/threads/create_url?url=" + encodeURIComponent(url),
			onload: warn,
			onerror: warn,
			user: 'jannis',
			password: 'deluxe234',
			method: "GET"
		});
	} catch(e) {
		console.log(e);
	}
}

function warnNotSaved(response, url) {
	var json;
	try {
		json = JSON.parse(response.responseText);
	} catch(e) {}
	if(response && response.status === 200 && json && json.success) {
		// success!
	} else {
		console.log(response);
		console.log(url);
		console.log("could not save " + url);
	}
}

function threadKey(id) {
	return "thread-" + id;
}

function threadIdForThread(thread) {
	return thread.attr("id").split("-").pop();
}

function toggleHidden(id, state) {
	var action = function () {
		var gmKey = threadKey(id);
		/* true = hidden, false = visible */
		var status = state === undefined ? GM_getValue(gmKey, true) : !state;
		GM_setValue(gmKey, !status);
		setThreadVisibility(id, !status);
	}
	setTimeout(action, 0);
}

function setHidden(id) {
	var action = function () {
		/* true = hidden, false = visible */
		GM_setValue(threadKey(id), false);
		setThreadVisibility(id, false);
	}
	setTimeout(action, 0);	
}


function setThreadVisibility(id, visible) {
	$("#thread-" + id).toggleClass("gm_hidden", !visible);
}

function loadThreadsFromUrl() {
	var threads;
	setTimeout(function () {
		GM_xmlhttpRequest({
			url: "http://shots2.roflzomfg.de/4chan/threads.txt?x=" + Math.round(Math.random() * 100000),
			method: "GET",
			onload: onThreadsFromUrlLoaded
		});
	}, 0);
}

function onThreadsFromUrlLoaded(response) {
	var currentBoard = document.location.href.split("/")[3];
	urls = response.responseText.split("\n");
	console.log("found " + urls.length + " urls on server");
	threads = response.responseText.split("\n").map(function (a) {
		var parts = a.split("/");
		var board = parts[3];
		var id = parts[5];
		if (board === currentBoard) {
			console.log(id);
			setThreadVisibility(id, false);
		}
		return {
			board: board,
			id: id
		};
	});
}

function renameBoardLinks() {
	$('.boardList a').each(function () {
		var e = $(this);
		e.text(e.attr('title'));
	});
}

function initalizePreview() {
	return;
	var previewContainer = $('<div>').addClass('previewContainer scaled');
	onResize();

	var imageContainer = $('<img>').addClass('previewImage');
	imageContainer.load(logCall(adjustSize));
	imageContainer.click(function() { previewContainer.toggleClass("scaled") });
	previewContainer.append(imageContainer);

	$('body').append(previewContainer);

	var imagePosts = $('.post:has(.fileThumb)');
	imagePosts.addClass('imagePost');
	$('.thread').on('click', '.imagePost', function () {
		var e = $(this);
		var src = e.find('.fileThumb').attr("href");
		if (imageContainer.attr('src') == src) {
			return;
		}
		imageContainer.attr('src', '');
		imageContainer.attr('src', src);
	});
	adjustSize();

	function onResize() {
		previewContainer.height($(window).height() + "px");
	}
	$(window).resize(onResize);

	function adjustSize() {
		var width = $(window).width() - 600; /* comments are roughly 600 px wide */

		var imageScrolls = imageContainer.height() > previewContainer.height();
		var scrollbarWidth = imageScrolls ? 13 : 0;
		previewContainer.width(width + scrollbarWidth + "px");
	}
}

function initializeThreadList() {
	var area = $("<textarea>").attr("id", "threadList").css({
		width: "800px"
	});

	$("body").append(area);
}

function appendThreadURL(url) {
	var val = $("#threadList").val();
	val += url + "\n";
	$("#threadList").val(val);
}

function installImageBrowser() {
	var s = $('<span>');
	s.append(document.createTextNode('['));
	var a = $('<a>').click(imageBrowser).text('Image Browser').attr('href', 'javascript:void(0)');
	s.append(a);
	s.append(document.createTextNode(']'));
	$('.navLinks').append(s);
}

function imageBrowser() {
	var images = $('.fileThumb');
	$('.thread').empty();
	var c = $('<div>').css({float: 'left', width: '60%'});
	c.append(images);
	$('.thread').append(c);
}


$(function () {
	var matcher = new UrlMatcher();
	matcher.add(/./, cleanup);
	matcher.add(/catalog/, onCatalogLoaded);
	matcher.add(/catalog/, initializeThreadList);
	matcher.add(/\/thread\/\d+/, onThread);
	matcher.add(/\/thread\/\d+/, initalizePreview);
	matcher.add(/www\.4chan\.org/, replaceLinks);
	matcher.add(/thread/, installImageBrowser);

	matcher.run(document.location.href);

	renameBoardLinks();

	$(window).keypress(function (event) {
		if(event.ctrlKey) {
			return;
		}
		if (event.which === 121) {
			//console.log(firstVisibleThread());
			firstVisibleThread().addClass('gm_hidden');
			//console.log("temp. hide");
		}
		if (event.which === 97) {
			firstVisibleThread().find('.hide').click();
			//console.log("hide");
		}
		if (event.which === 100) {
			firstVisibleThread().find('.save').click();
			//console.log("save");
		}
	});

});

function firstVisibleThread() {
	return $('.thread:not(.gm_hidden):first()');
}

function onThread() {
	var container = createMenu();

	var id = document.location.pathname.split("/").pop();

	function createMenu() {
		return;
		var linkCss = {
			display: "block"
		};
		var hide = $("<a>").text("hide").css(linkCss).click(onHide);
		var save = $("<a>").text("save").css(linkCss);

		c = $("<div>").append(hide, save);

		c.css({
			"position": "fixed",
			"left": 0 + "px",
			"top": 0 + "px",
			"backgroundColor": "#AAA",
		});

		$("body").append(c);
		return c;
	}

	function onHide() {
		toggleHidden(id);
		unsafeWindow.close();
	}




}