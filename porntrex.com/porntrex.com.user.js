// ==UserScript==
// @name         porntrex.com
// @namespace    porntrex.com
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.porntrex.com/video/*
// @match        https://www.porntrex.com/playlists/*
// @match        https://www.porntrex.com/embed/*
// @grant        none
// ==/UserScript==
function injectCss(css) {
    $('<style rel="stylesheet" type="text/css">').text(css).appendTo("head");
}

(function() {
    if(document.location.href.match(/\/video\//)) {
        video();
    }
    if(document.location.href.match(/\/playlists\//)) {
        playlists();
    }

    if(document.location.href.match(/\/embed\//)) {
        console.log(3);    
        var newUrl = document.location.href.replace("embed", 'video') + "/asd";
        document.location.href = newUrl;
    }

 })();

 function playlists() {
    var videos = $('.owl-stage, .owl-item').removeAttr("style");
    var css = `
    .owl-stage { display: flex; flex-wrap: wrap; }
    .owl-item { flex: 1 1 25%; }
    `
    injectCss(css);
    $('.video-holder .player, .owl-nav, .owl-dots, .owl-item.cloned').remove();

    $(".owl-item, .owl-item *").off();
 }

 function video() {
    var css = `
    .previewImages { display: grid; grid-template-columns: repeat(5, 20%); grid-gap: .5rem; }
    .previewImage { width: 100%; }
    `
    injectCss(css);

    function cleanup() {
        $(".link-holder-top").remove();
    }

    function selectOnHover(event) {
        event.target.focus();
        event.target.select();
    }

    function titleToSize(title) {
      return parseInt(title, 10);
    }

    var baseUrl = "https://thumbs.porntrex.com/contents/videos_screenshots/$$$id_range/$$$id/timelines/timeline_mp4/200x116/$$$num.jpg"

    function screencapUrls(url, count) {
        var result = [];
        var imageCount = duration / 10;
        for (let i = 1; i <= count; i++) {
            var num = Math.floor(imageCount / count) * i + 1;
            result.push(url.replace('{time}', num));
        }
        return result;
    }

    cleanup();

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
    
    var urls = screencapUrls(info.timeline_screens_url, 15);
    var imagesContainer = $("<div class='previewImages'>").appendTo(".player");
    urls.forEach(function(url) {
        imagesContainer.append($("<img class='previewImage'>").attr("src", url));
    })
 } 
