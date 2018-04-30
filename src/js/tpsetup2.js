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
            e.preventDefault();

            if (this.e.tpWord.value === "") {
                this.e.tpWord.style.border = "2px solid crimson";
            } else {
                this.e.tpWord.style.border = "initial";
            }

            if (this.e.tpHints.value === "") {
                this.e.tpHints.style.border = "2px solid crimson";
            } else {
                this.e.tpHints.style.border = "initial";
            }

            if (this.e.tpWord.value !== "" && this.e.tpHints.value !== "") {
                this.saveToLS();
                this.e.form.submit();
            }
        })
    },

    init: function () {
        this.setListeners();
        this.e.playerTurn.innerHTML = localStorage.getItem("playerTurn");
    }
};

twoPlayersetUp2.init();