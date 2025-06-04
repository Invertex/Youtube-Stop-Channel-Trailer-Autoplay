// ==UserScript==
// @name         YT Stop Channel Trailer Autoplay
// @namespace    Invertex
// @version      0.1
// @description  Stops the Channel Trailer from auto-playing.
// @author       Invertex
// @updateURL    https://github.com/Invertex/Youtube-Stop-Channel-Trailer-Autoplay/raw/main/yt_stop_channel_autoplay.user.js
// @downloadURL  https://github.com/Invertex/Youtube-Stop-Channel-Trailer-Autoplay/raw/main/yt_stop_channel_autoplay.user.js
// @match        https://*.youtube.com/@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-body
// ==/UserScript==

function findElem(rootElem, query, observer, resolve)
{
    const elem = rootElem.querySelector(query);
    if (elem != null && elem != undefined)
    {
        observer?.disconnect();
        resolve(elem);
    }
    return elem;
}

async function awaitElem(root, query, obsArguments = {childList: true, subtree:true, attributes: false})
{
    return new Promise((resolve, reject) =>
    {
        if (findElem(root, query, null, resolve)) { return; }
        const rootObserver = new MutationObserver((mutes, obs) => {
            findElem(root, query, obs, resolve);
        });
        rootObserver.observe(root, obsArguments);
    });
}
async function sleep(seconds) {
    return new Promise((resolve) =>setTimeout(resolve, seconds * 1000));
}

function stopVidPlay(e)
{
    e.target.pause();
    e.target.removeEventListener('play', stopVidPlay);
}

(async function() {
    'use strict';

    let trailerElem = await awaitElem(document.body, '#player-container video');
    trailerElem.pause();
    trailerElem.addEventListener("play", stopVidPlay);
})();
