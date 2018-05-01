"use strict";

var loader = document.getElementById("loader");
var main = document.getElementById("section-main");

// On Window Load
window.addEventListener("load", function (e) {
    setTimeout(function () {
        loader.classList.add("loader__hidden");
    }, 100);

    main.classList.remove("main--hidden");
});

sessionStorage.removeItem("refreshed");