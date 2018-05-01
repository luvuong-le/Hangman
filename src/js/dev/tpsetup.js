let twoPlayersetUp = {
    e: {
        tp1: document.getElementById("tp__p1"),
        tp2: document.getElementById("tp__p2"),
        continue: document.getElementById("tp__continue"),
        continueBtnPhase2: document.getElementById("tp__continue-2"),
        form: document.getElementById("tp__name__form")
    },

    saveToLS: function() {
        localStorage.setItem("player1Name", this.e.tp1.value);
        localStorage.setItem("player2Name", this.e.tp2.value);
        localStorage.setItem("playerTurn", this.e.tp1.value);
    },  

    setListeners: function() {
        this.e.continue.addEventListener("click", (e) => {
            this.saveToLS();
        })
    },

    init: function() {
        this.setListeners();
    }
};

twoPlayersetUp.init();