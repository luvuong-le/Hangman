"use strict";

var twoPlayersetUp2 = {
    e: {
        tpWord: document.getElementById("tp__word"),
        tpHints: document.getElementById("tp__hints"),
        continueBtnPhase2: document.getElementById("tp__continue-2"),
        form: document.getElementById("tp__gameinfo__form"),
        playerTurn: document.getElementById("main__header__player")
    },

    saveToLS: function saveToLS() {
        localStorage.setItem("twoPlayerWord", this.e.tpWord.value);
        localStorage.setItem("twoPlayerHints", this.e.tpHints.value);
    },

    setListeners: function setListeners() {
        var _this = this;

        this.e.continueBtnPhase2.addEventListener("click", function (e) {
            _this.saveToLS();
        });
    },

    init: function init() {
        this.setListeners();

        if (sessionStorage.getItem("gameState") !== null) {
            var gameStateData = JSON.parse(sessionStorage.getItem("gameState"));

            if (gameStateData.playerToGuess === 1) {
                this.e.playerTurn.innerHTML = gameStateData.player2.name;
            } else {
                this.e.playerTurn.innerHTML = gameStateData.player1.name;
            }
        } else {
            this.e.playerTurn.innerHTML = localStorage.getItem("playerTurn");
        }
    }
};

twoPlayersetUp2.init();