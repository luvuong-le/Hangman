"use strict";

var twoPlayersetUp = {
    e: {
        tp1: document.getElementById("tp__p1"),
        tp2: document.getElementById("tp__p2"),
        continue: document.getElementById("tp__continue"),
        continueBtnPhase2: document.getElementById("tp__continue-2"),
        form: document.getElementById("tp__name__form")
    },

    saveToLS: function saveToLS() {
        localStorage.setItem("player1Name", this.e.tp1.value);
        localStorage.setItem("player2Name", this.e.tp2.value);
        localStorage.setItem("playerTurn", this.e.tp1.value);
    },

    setListeners: function setListeners() {
        var _this = this;

        this.e.continue.addEventListener("click", function (e) {
            _this.saveToLS();
        });
    },

    init: function init() {
        this.setListeners();
    }
};

twoPlayersetUp.init();