let tpManager = {

    gameState: {
        randomWord: "",
        hiddenLetters: null,
        hints: null,
        lettersGuessed: [],
        spacesInword: null,
        hintLetters: [],
        lives: 6,
        player1: {
            name: null,
            score: 0,
        },
        player2: {
            name: null, 
            score: 0,
        },
        playerToGuess: 2,
    },

    e: {
        wordContainer: document.getElementById("game__content-word"),
        lettersGuessedCont: document.getElementById("game__content-letter-guessed-cont"),
        inputs: document.querySelectorAll(".game__content-letter--input"),
        hiddenLetters: null,
        hintsBtn: document.getElementById("game__content-hints_btn"),
        hangmanImg: document.getElementById("hangman_img"),
        nextRoundBtn: document.getElementById("next_round"),
        playerToGuess: document.getElementById("player_to_guess"),
        showScoreBtn: document.getElementById("show_score"),
        scoreBoard: document.getElementById("score_board"),
        scoreBoardClose: document.getElementById("game-result__close"),
        scoreBoardP1Name: document.getElementById("game-result__p1Name"),
        scoreBoardP1Score: document.getElementById("game-result__p1Score"),
        scoreBoardP2Name: document.getElementById("game-result__p2Name"),
        scoreBoardP2Score: document.getElementById("game-result__p2Score")
    },

    //  Get a random word from the returned array
    getRandomWord: function () {
        return localStorage.getItem("twoPlayerWord");
    },

    // Build the hidden fields in the UI
    //.game__content-letter.game__content-letter--guessed
    // span.game__content-letter-text A
    setWord: function (word) {
        for (let i = 0; i < word.length; i++) {
            let div = document.createElement("div");

            if (word[i] === " ") {
                div.className = "game__content-letter game__content-letter--hidden game__content-letter--space";
            } else {
                div.className = "game__content-letter game__content-letter--hidden";
            }

            this.e.wordContainer.appendChild(div);
        }
        this.e.hiddenLetters = document.querySelectorAll(".game__content-letter--hidden")
    },

    removeLSState: function () {
        localStorage.removeItem("playerTurn");
        localStorage.removeItem("twoPlayerHints");
        localStorage.removeItem("twoPlayerWord");
        localStorage.setItem("gameSet", true);
    },

    setState: function () {
        this.gameState.randomWord = this.getRandomWord().toLowerCase();
        this.gameState.hiddenLetters = this.gameState.randomWord.length;
        this.gameState.spacesInword = this.getSpacesInWord();
        this.gameState.hiddenLetters = this.gameState.hiddenLetters - this.gameState.spacesInword;
        this.gameState.hintLetters = this.gameState.randomWord.replace(/\s/g, '').split("");
        this.gameState.lives = 6;
        this.gameState.lettersGuessed = [];
        this.setWord(this.gameState.randomWord);
        this.gameState.hints = parseInt(localStorage.getItem("twoPlayerHints"));
        this.e.hintsBtn.innerHTML = `Hints (${localStorage.getItem("twoPlayerHints")})`;
        this.e.hangmanImg.src = "../../src/images/hangman_6.png";

        // Set player details
        this.gameState.player1.name = localStorage.getItem("player1Name");
        this.gameState.player2.name = localStorage.getItem("player2Name");
        this.e.playerToGuess.innerHTML = `Player To Guess: ${this.getPlayerToGuessName()}`;

        // Set Score Details 
        this.updateScoreUI();
    },

    getPlayerToGuessName: function() {
        if (this.gameState.playerToGuess === 1) {
            return this.gameState.player1.name;
        } else {
            return this.gameState.player2.name;
        } 
    },

    getSpacesInWord: function () {
        let spaces = 0;

        for (let i = 0; i < this.gameState.randomWord.length; i++) {
            if (this.gameState.randomWord[i] === " ") {
                spaces = spaces + 1;
            }
        }

        return spaces;
    },

    guess: function (letterGuess) {
        if (this.gameState.lives !== 0) {
            // Check if the letter to guess is in the randomWord
            if (this.gameState.randomWord.includes(letterGuess)) {
                let newIndices = this.findLetters(letterGuess);

                // Find those letters in the UI and replace them with the letter guess
                this.replaceLetters(newIndices, letterGuess);

                // Run a check to see if hidden letter is 0 and the game is won
                if (this.gameState.hiddenLetters === 0) {
                    for (let letter of document.querySelectorAll(".game__content-letter--shown")) {
                        letter.style.color = "green";
                        letter.style.textShadow = ".1rem .1rem .5rem green";
                    }

                    // Block out all letters from being clickable
                    for (let input of this.e.inputs) {
                        input.style.pointerEvents = "none";
                    }

                    this.updateWinScore();
                    this.updateScoreUI();
                }

            } else {
                if (!this.gameState.lettersGuessed.includes(letterGuess)) {
                    this.incorrectLetter(letterGuess);
                }
            }
        }
    },

    findLetters: function (letter) {
        let indicies = [];
        for (let i = 0; i < this.gameState.randomWord.length; i++) {
            if (this.gameState.randomWord[i] === letter) {
                indicies.push(i);
            }
        }

        return indicies;
    },

    replaceLetters: function (indices, letter) {
        for (let i of indices) {
            this.e.hiddenLetters[i].innerHTML = letter;

            this.e.hiddenLetters[i].className = "game__content-letter game__content-letter--shown";

            // Minus one letter from hidden letters in the game state object
            this.gameState.hiddenLetters--;

            this.gameState.hintLetters = this.gameState.hintLetters.filter((string) => {
                return string !== letter;
            });
        }
    },

    incorrectLetter: function (letter) {
        let newLetter = document.createElement("div");
        newLetter.className = "game__content-letter game__content-letter--guessed";

        let span = document.createElement("span");
        span.className = "game__content-letter-text";

        let text = document.createTextNode(letter);

        span.appendChild(text);

        newLetter.appendChild(span);

        this.e.lettersGuessedCont.appendChild(newLetter);

        this.gameState.lettersGuessed.push(letter);

        // Minus Live by 1 and Change image
        this.gameState.lives--;

        this.e.hangmanImg.src = `../../src/images/hangman_${this.gameState.lives}.png`;

        if (this.gameState.lives === 0) {
            // Show all the letters in the word
            this.showWord();

            for (let letter of document.querySelectorAll(".game__content-letter--shown")) {
                letter.style.color = "crimson";
                letter.style.textShadow = ".1rem .1rem .5rem crimson";
            }

            // Block out all letters from being clickable
            for (let input of this.e.inputs) {
                input.style.pointerEvents = "none";
                input.style.background = "#ccc";
            }
        }
    },

    swapTurns: function() {
        if (this.gameState.playerToGuess === 1) {
            this.gameState.playerToGuess = 2;
        } else {
            this.gameState.playerToGuess = 1;
        } 
    },

    updateWinScore: function() {
        if (this.gameState.playerToGuess === 1) {
            this.gameState.player1.score++;
        } else {
            this.gameState.player2.score++;
        }
    },

    updateScoreUI: function() {
        this.e.scoreBoardP1Name.innerHTML = this.gameState.player1.name;
        this.e.scoreBoardP2Name.innerHTML = this.gameState.player2.name;
        this.e.scoreBoardP1Score.innerHTML = this.gameState.player1.score;
        this.e.scoreBoardP2Score.innerHTML = this.gameState.player2.score;
    },

    useHint: function () {
        return this.gameState.hintLetters[Math.floor(Math.random() * this.gameState.hintLetters.length)];
    },

    updateHintStatus: function () {
        this.gameState.hints--;
        this.e.hintsBtn.innerHTML = `Hints (${this.gameState.hints})`;
    },

    showWord: function () {
        let randomword = this.gameState.randomWord.split("");
        for (let i = 0; i < this.e.hiddenLetters.length; i++) {
            this.e.hiddenLetters[i].innerHTML = randomword[i];
            this.e.hiddenLetters[i].className = "game__content-letter game__content-letter--shown";
        }
    },

    setListeners: function () {
        for (let input of this.e.inputs) {
            input.addEventListener("click", (e) => {
                this.guess(e.target.innerHTML.toLowerCase());
                input.style.pointerEvents = "none";
                input.style.background = "#ccc";
            })
        }

        this.e.hintsBtn.addEventListener("click", () => {
            if (this.gameState.hints !== 0 && this.gameState.lives !== 0) {
                this.guess(this.useHint());
                this.updateHintStatus();
            } else {
                alert("Hints are not usable");
            }
        });

        this.e.nextRoundBtn.addEventListener("click", () => {
            this.swapTurns();

            // Save current game state to session storage
            sessionStorage.setItem("gameState", JSON.stringify(this.gameState));

            window.location.href = "/?mode-twoplayers-setup-2.html";
        });

        this.e.showScoreBtn.addEventListener("click", () => {
            this.e.scoreBoard.style.transform = "scale(1) translate(-50%, -50%)";
        });

        this.e.scoreBoardClose.addEventListener("click", () => {
            this.e.scoreBoard.style.transform = "scale(0) translate(-50%, -50%)";
        });
    },

    updateGameState: function() {
        this.gameState = JSON.parse(sessionStorage.getItem("gameState"));
    },

    init: function () {
        if (sessionStorage.getItem("gameState") !== null) {
            this.updateGameState();
            sessionStorage.removeItem("gameState");
        }
        this.setState();
        this.removeLSState();
        this.setListeners();
    }
};

function checkRefresh() {
    if (sessionStorage.getItem("refreshed") === "true") {
        window.location.href = "/";
    }
}

window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("refreshed", "true");
});

checkRefresh();
 
tpManager.init();
