// ==UserScript==
// @name         porntrex.com
// @namespace    porntrex.com
// @version      2
// @author       You
// @match        https://www.porntrex.com/video/*
// @grant        none
// ==/UserScript==

(function() {

    function selectOnHover(event) {
        event.target.focus();
        event.target.select();
    }

    function titleToSize(title) {
      return parseInt(title, 10);
    }

    console.log(window.flashvars);
    var info = window.flashvars;
    var url = document.location.href;
    var poster = "https:" + info.preview_url;
    var id = "porntrex.com-" + info.video_id;
    var title = $.trim($(".headline h1").text());
    var duration;
    if(m = $(".block-details .info .item:first").text().match(/(\d+)min\s+(\d+)sec/)) {
        duration = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    }
    var urls = [];

    if(info.video_url) {
        urls.push({url: info.video_url, size: titleToSize(info.video_url_text)});
    }
    if(info.video_alt_url) {
        urls.push({url: info.video_alt_url, size: titleToSize(info.video_alt_url_text)});
    }
    if(info.video_alt_url2) {
        urls.push({url: info.video_alt_url2, size: titleToSize(info.video_alt_url2_text)});
    }
    if(info.video_alt_url3) {
        urls.push({url: info.video_alt_url3, size: titleToSize(info.video_alt_url3_text)});
    }
    if(info.video_alt_url4) {
        urls.push({url: info.video_alt_url4, size: titleToSize(info.video_alt_url4_text)});
    }
    if(info.video_alt_url5) {
        urls.push({url: info.video_alt_url5, size: titleToSize(info.video_alt_url5_text)});
    }
    if(info.video_alt_url6) {
        urls.push({url: info.video_alt_url6, size: titleToSize(info.video_alt_url6_text)});
    }

    json = JSON.stringify({
        url: url, poster: poster, id: id, title: title, videoUrls: urls, duration: duration
    });

    var textarea = $("<textarea>").val(json);
    textarea.css({width: "100%"});
    textarea.on("mouseenter", selectOnHover);

    $(".video-holder").prepend(textarea);

 })();
