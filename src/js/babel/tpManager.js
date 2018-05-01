"use strict";

var tpManager = {

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
            score: 0
        },
        player2: {
            name: null,
            score: 0
        },
        playerToGuess: 2
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
    getRandomWord: function getRandomWord() {
        return localStorage.getItem("twoPlayerWord");
    },

    // Build the hidden fields in the UI
    //.game__content-letter.game__content-letter--guessed
    // span.game__content-letter-text A
    setWord: function setWord(word) {
        for (var i = 0; i < word.length; i++) {
            var div = document.createElement("div");

            if (word[i] === " ") {
                div.className = "game__content-letter game__content-letter--hidden game__content-letter--space";
            } else {
                div.className = "game__content-letter game__content-letter--hidden";
            }

            this.e.wordContainer.appendChild(div);
        }
        this.e.hiddenLetters = document.querySelectorAll(".game__content-letter--hidden");
    },

    removeLSState: function removeLSState() {
        localStorage.removeItem("playerTurn");
        localStorage.removeItem("twoPlayerHints");
        localStorage.removeItem("twoPlayerWord");
        localStorage.setItem("gameSet", true);
    },

    setState: function setState() {
        if (this.getRandomWord() === null) {
            window.location.href = "/";
        } else {
            this.gameState.randomWord = this.getRandomWord().toLowerCase();
        }
        this.gameState.hiddenLetters = this.gameState.randomWord.length;
        this.gameState.spacesInword = this.getSpacesInWord();
        this.gameState.hiddenLetters = this.gameState.hiddenLetters - this.gameState.spacesInword;
        this.gameState.hintLetters = this.gameState.randomWord.replace(/\s/g, '').split("");
        this.gameState.lives = 6;
        this.gameState.lettersGuessed = [];
        this.setWord(this.gameState.randomWord);
        this.gameState.hints = parseInt(localStorage.getItem("twoPlayerHints"));
        this.e.hintsBtn.innerHTML = "Hints (" + localStorage.getItem("twoPlayerHints") + ")";
        this.e.hangmanImg.src = "../../src/images/hangman_6.png";

        // Set player details
        this.gameState.player1.name = localStorage.getItem("player1Name");
        this.gameState.player2.name = localStorage.getItem("player2Name");
        this.e.playerToGuess.innerHTML = "Player To Guess: " + this.getPlayerToGuessName();

        // Set Score Details 
        this.updateScoreUI();
    },

    getPlayerToGuessName: function getPlayerToGuessName() {
        if (this.gameState.playerToGuess === 1) {
            return this.gameState.player1.name;
        } else {
            return this.gameState.player2.name;
        }
    },

    getSpacesInWord: function getSpacesInWord() {
        var spaces = 0;

        for (var i = 0; i < this.gameState.randomWord.length; i++) {
            if (this.gameState.randomWord[i] === " ") {
                spaces = spaces + 1;
            }
        }

        return spaces;
    },

    guess: function guess(letterGuess) {
        if (this.gameState.lives !== 0) {
            // Check if the letter to guess is in the randomWord
            if (this.gameState.randomWord.includes(letterGuess)) {
                var newIndices = this.findLetters(letterGuess);

                // Find those letters in the UI and replace them with the letter guess
                this.replaceLetters(newIndices, letterGuess);

                // Run a check to see if hidden letter is 0 and the game is won
                if (this.gameState.hiddenLetters === 0) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = document.querySelectorAll(".game__content-letter--shown")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var letter = _step.value;

                            letter.style.color = "green";
                            letter.style.textShadow = ".1rem .1rem .5rem green";
                        }

                        // Block out all letters from being clickable
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this.e.inputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var input = _step2.value;

                            input.style.pointerEvents = "none";
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    this.e.hintsBtn.style.pointerEvents = "none";

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

    findLetters: function findLetters(letter) {
        var indicies = [];
        for (var i = 0; i < this.gameState.randomWord.length; i++) {
            if (this.gameState.randomWord[i] === letter) {
                indicies.push(i);
            }
        }

        return indicies;
    },

    replaceLetters: function replaceLetters(indices, letter) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = indices[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var i = _step3.value;

                this.e.hiddenLetters[i].innerHTML = letter;

                this.e.hiddenLetters[i].className = "game__content-letter game__content-letter--shown";

                // Minus one letter from hidden letters in the game state object
                this.gameState.hiddenLetters--;

                this.gameState.hintLetters = this.gameState.hintLetters.filter(function (string) {
                    return string !== letter;
                });
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    },

    incorrectLetter: function incorrectLetter(letter) {
        var newLetter = document.createElement("div");
        newLetter.className = "game__content-letter game__content-letter--guessed";

        var span = document.createElement("span");
        span.className = "game__content-letter-text";

        var text = document.createTextNode(letter);

        span.appendChild(text);

        newLetter.appendChild(span);

        this.e.lettersGuessedCont.appendChild(newLetter);

        this.gameState.lettersGuessed.push(letter);

        // Minus Live by 1 and Change image
        this.gameState.lives--;

        this.e.hangmanImg.src = "../../src/images/hangman_" + this.gameState.lives + ".png";

        if (this.gameState.lives === 0) {
            // Show all the letters in the word
            this.showWord();

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = document.querySelectorAll(".game__content-letter--shown")[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _letter = _step4.value;

                    _letter.style.color = "crimson";
                    _letter.style.textShadow = ".1rem .1rem .5rem crimson";
                }

                // Block out all letters from being clickable
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.e.inputs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var input = _step5.value;

                    input.style.pointerEvents = "none";
                    input.style.background = "#ccc";
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    },

    swapTurns: function swapTurns() {
        if (this.gameState.playerToGuess === 1) {
            this.gameState.playerToGuess = 2;
        } else {
            this.gameState.playerToGuess = 1;
        }
    },

    updateWinScore: function updateWinScore() {
        if (this.gameState.playerToGuess === 1) {
            this.gameState.player1.score++;
        } else {
            this.gameState.player2.score++;
        }
    },

    updateScoreUI: function updateScoreUI() {
        this.e.scoreBoardP1Name.innerHTML = this.gameState.player1.name;
        this.e.scoreBoardP2Name.innerHTML = this.gameState.player2.name;
        this.e.scoreBoardP1Score.innerHTML = this.gameState.player1.score;
        this.e.scoreBoardP2Score.innerHTML = this.gameState.player2.score;
    },

    useHint: function useHint() {
        // Get a random letter from array 
        var randomLetter = this.gameState.hintLetters[Math.floor(Math.random() * this.gameState.hintLetters.length)];

        // Make the letter disabled in letter container
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = this.e.inputs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var input = _step6.value;

                if (input.innerHTML.toLowerCase() === randomLetter) {
                    input.style.pointerEvents = "none";
                    input.style.background = "#ccc";
                }
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        return randomLetter;
    },

    updateHintStatus: function updateHintStatus() {
        this.gameState.hints--;
        this.e.hintsBtn.innerHTML = "Hints (" + this.gameState.hints + ")";
    },

    showWord: function showWord() {
        var randomword = this.gameState.randomWord.split("");
        for (var i = 0; i < this.e.hiddenLetters.length; i++) {
            this.e.hiddenLetters[i].innerHTML = randomword[i];
            this.e.hiddenLetters[i].className = "game__content-letter game__content-letter--shown";
        }
    },

    setListeners: function setListeners() {
        var _this = this;

        var _loop = function _loop(input) {
            input.addEventListener("click", function (e) {
                _this.guess(e.target.innerHTML.toLowerCase());
                input.style.pointerEvents = "none";
                input.style.background = "#ccc";
            });
        };

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = this.e.inputs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var input = _step7.value;

                _loop(input);
            }
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }

        this.e.hintsBtn.addEventListener("click", function () {
            if (_this.gameState.hints !== 0 && _this.gameState.lives !== 0) {
                _this.guess(_this.useHint());
                _this.updateHintStatus();
            } else {
                alert("Hints are not usable");
            }
        });

        this.e.nextRoundBtn.addEventListener("click", function () {
            _this.swapTurns();

            // Save current game state to session storage
            sessionStorage.setItem("gameState", JSON.stringify(_this.gameState));

            window.location.href = "/?mode-twoplayers-setup-2.html";
        });

        this.e.showScoreBtn.addEventListener("click", function () {
            _this.e.scoreBoard.style.transform = "scale(1) translate(-50%, -50%)";
        });

        this.e.scoreBoardClose.addEventListener("click", function () {
            _this.e.scoreBoard.style.transform = "scale(0) translate(-50%, -50%)";
        });
    },

    updateGameState: function updateGameState() {
        this.gameState = JSON.parse(sessionStorage.getItem("gameState"));
    },

    init: function init() {
        if (sessionStorage.getItem("gameState") !== null) {
            this.updateGameState();
            sessionStorage.removeItem("gameState");
        }
        this.setState();
        this.removeLSState();
        this.setListeners();
    }
};

tpManager.init();