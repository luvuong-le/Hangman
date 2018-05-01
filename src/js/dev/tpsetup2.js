let twoPlayersetUp2 = {
    e: {
        tpWord: document.getElementById("tp__word"),
        tpHints: document.getElementById("tp__hints"),
        continueBtnPhase2: document.getElementById("tp__continue-2"),
        form: document.getElementById("tp__gameinfo__form"),
        playerTurn: document.getElementById("main__header__player")
    },

    saveToLS: function () {
        localStorage.setItem("twoPlayerWord", this.e.tpWord.value);
        localStorage.setItem("twoPlayerHints", this.e.tpHints.value);
    },

    setListeners: function () {
        this.e.continueBtnPhase2.addEventListener("click", (e) => {
            this.saveToLS();
        });
    },

    init: function () {
        this.setListeners();

        if (sessionStorage.getItem("gameState") !== null) {
            let gameStateData = JSON.parse(sessionStorage.getItem("gameState"));

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