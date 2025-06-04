// ==UserScript==
// @name         YT Stop Channel Trailer Autoplay
// @namespace    Invertex
// @version      0.12
// @description  Stops the Channel Trailer from auto-playing.
// @author       Invertex
// @updateURL    https://github.com/Invertex/Youtube-Stop-Channel-Trailer-Autoplay/raw/main/yt_stop_channel_autoplay.user.js
// @downloadURL  https://github.com/Invertex/Youtube-Stop-Channel-Trailer-Autoplay/raw/main/yt_stop_channel_autoplay.user.js
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-body
// @require      https://github.com/Invertex/Invertex-Userscript-Tools/raw/main/userscript_tools.js
// ==/UserScript==

function stopVidPlay(e)
{
    e.target.pause();
    e.target.removeEventListener('play', stopVidPlay);
}

async function onPageUpdate() {
   // console.log("on page change");
    if(!window.location.href.includes('.com/@')) { return; }

    let trailerElemContainer = await awaitElem(document.body, 'ytd-app #content #player-container .html5-video-player');


    if(addHasAttribute(trailerElemContainer, 'yt-stop-autoplay')) { return; }
    let trailerElem = await awaitElem(trailerElemContainer, 'video');
    trailerElem.pause();
    trailerElem.addEventListener("play", stopVidPlay);

    watchForChangeFull(trailerElemContainer,{childList: true, subtree: true, attributes: true}, (elem, mutes)=>{
         if(elem.classList.contains('ytp-hide-controls')) { elem.removeAttribute('yt-stop-autoplay'); }
    });
};

awaitElem(document.body, 'ytd-app').then((elem)=>
{
    onPageUpdate();
    watchForChangeFull(elem, {childList: true, subtree: true, attributes: false}, onPageUpdate);
});
