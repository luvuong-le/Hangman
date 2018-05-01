"use strict";

var appManager = {

    gameState: {
        category: "",
        categoryWords: null,
        randomWord: "",
        hiddenLetters: null,
        hints: 3,
        lettersGuessed: [],
        spacesInword: null,
        hintLetters: [],
        lives: 6
    },

    e: {
        wordContainer: document.getElementById("game__content-word"),
        lettersGuessedCont: document.getElementById("game__content-letter-guessed-cont"),
        inputs: document.querySelectorAll(".game__content-letter--input"),
        hiddenLetters: null,
        hintsBtn: document.getElementById("game__content-hints_btn"),
        hangmanImg: document.getElementById("hangman_img"),
        nextRoundBtn: document.getElementById("next_round"),
        categoryTitle: document.getElementById("category_span")
    },

    getCategory: function getCategory() {
        return localStorage.getItem('category');
    },

    // Based on Category Choice: Return an array of words
    saveCategoryWordsLS: function saveCategoryWordsLS() {
        var _this = this;

        fetch('./data/game-content.json').then(function (res) {
            return res.json();
        }).then(function (data) {
            localStorage.setItem('categoryWords', JSON.stringify(data));
        }).then(function () {
            _this.setState();
            _this.removeLSState();
        }).catch(function (error) {
            console.log('Request failed', error);
        });
    },

    //  Get a random word from the returned array
    getRandomWord: function getRandomWord() {
        return this.gameState.categoryWords[Math.floor(Math.random() * this.gameState.categoryWords.length)];
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

    setCategoryWords: function setCategoryWords() {
        var words = JSON.parse(localStorage.getItem('categoryWords'));
        return words[this.getCategory().toLowerCase()];
    },

    removeLSState: function removeLSState() {
        localStorage.removeItem("categoryWords");
    },

    setState: function setState() {
        this.gameState.categoryWords = this.setCategoryWords();
        this.gameState.randomWord = this.getRandomWord().toLowerCase();
        this.gameState.hiddenLetters = this.gameState.randomWord.length;
        this.gameState.spacesInword = this.getSpacesInWord();
        this.gameState.hiddenLetters = this.gameState.hiddenLetters - this.gameState.spacesInword;
        this.gameState.hintLetters = this.gameState.randomWord.replace(/\s/g, '').split("");
        this.setWord(this.gameState.randomWord);
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

    resetGame: function resetGame() {
        // Remove all children from hidden word 
        while (this.e.wordContainer.firstChild) {
            this.e.wordContainer.removeChild(this.e.wordContainer.firstChild);
        }

        // Remove all children from letters guessed container
        while (this.e.lettersGuessedCont.firstChild) {
            this.e.lettersGuessedCont.removeChild(this.e.lettersGuessedCont.firstChild);
        }

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = this.e.inputs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var input = _step7.value;

                input.style.pointerEvents = "";
                input.style.background = "#3498db";
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

        this.gameState.hiddenLetters = null;

        this.gameState.lettersGuessed = [];

        this.gameState.lives = 6;

        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = this.e.inputs[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var _input = _step8.value;

                _input.style.pointerEvents = "";
            }
        } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                }
            } finally {
                if (_didIteratorError8) {
                    throw _iteratorError8;
                }
            }
        }

        this.e.hintsBtn.style.pointerEvents = "";

        this.gameState.hints = 3;

        // Set up State
        this.gameState.category = this.getCategory();
        this.e.categoryTitle.innerHTML = "Category: " + this.gameState.category;
        this.e.hintsBtn.innerHTML = "Hints (" + this.gameState.hints + ")";
        this.e.hangmanImg.src = "../../src/images/hangman_6.png";
        this.saveCategoryWordsLS();
    },

    setListeners: function setListeners() {
        var _this2 = this;

        var _loop = function _loop(input) {
            input.addEventListener("click", function (e) {
                _this2.guess(e.target.innerHTML.toLowerCase());
                input.style.pointerEvents = "none";
                input.style.background = "#ccc";
            });
        };

        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            for (var _iterator9 = this.e.inputs[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var input = _step9.value;

                _loop(input);
            }
        } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                    _iterator9.return();
                }
            } finally {
                if (_didIteratorError9) {
                    throw _iteratorError9;
                }
            }
        }

        this.e.hintsBtn.addEventListener("click", function () {
            if (_this2.gameState.hints !== 0 && _this2.gameState.lives !== 0) {
                _this2.guess(_this2.useHint());
                _this2.updateHintStatus();
            } else {
                alert("Hints are not usable");
            }
        });

        this.e.nextRoundBtn.addEventListener("click", function () {
            _this2.resetGame();
        });
    },

    init: function init() {
        // Set up State
        this.gameState.category = this.getCategory();
        this.e.categoryTitle.innerHTML = "Category: " + this.gameState.category;
        this.e.hintsBtn.innerHTML = "Hints (" + this.gameState.hints + ")";
        this.e.hangmanImg.src = "../../src/images/hangman_6.png";
        this.saveCategoryWordsLS();

        // Add Listeners
        this.setListeners();
    }
};

appManager.init();