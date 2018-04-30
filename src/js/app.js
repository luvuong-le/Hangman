let appManager = {

    gameState: {
        category: "",
        categoryWords: null,
        randomWord: "",
        hiddenLetters: null,
        hints: 3,
        lettersGuessed: [],
        spacesInword: null,
        hintLetters: [],
        lives: 6,
    },

    e: {
        wordContainer: document.getElementById("game__content-word"),
        lettersGuessedCont: document.getElementById("game__content-letter-guessed-cont"),
        inputs: document.querySelectorAll(".game__content-letter--input"),
        hiddenLetters: null,
        hintsBtn: document.getElementById("game__content-hints_btn"),
        categoryTitle: document.getElementById("category_span"),
        hangmanImg: document.getElementById("hangman_img"),
        nextRoundBtn: document.getElementById("next_round"),
    },

    // Get Category Choice from User
    getCategory: function() {
        return localStorage.getItem('category');
    },

    // Based on Category Choice: Return an array of words
    saveCategoryWordsLS: function() {
        fetch('./data/game-content.json')
        .then(res => res.json())
        .then((data) => {
            localStorage.setItem('categoryWords', JSON.stringify(data));
        })
        .then(() => {
            this.setState();
            this.removeLSState();
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
    },

    //  Get a random word from the returned array
    getRandomWord: function() {
        return this.gameState.categoryWords[Math.floor(Math.random() * this.gameState.categoryWords.length)];
    },

    // Build the hidden fields in the UI
    //.game__content-letter.game__content-letter--guessed
    // span.game__content-letter-text A
    setWord: function(word) {
        for (let i = 0; i < word.length; i++) {
            let div = document.createElement("div");

            if (word[i] === " ") {
                div.className = "game__content-letter game__content-letter--hidden game__content-letter--space";
            } else {
                div.className = "game__content-letter game__content-letter--hidden";
                // let span = document.createElement("span");
                // span.className = "game__content-letter-text";
                //let text = document.createTextNode(word.charAt(i));
    
                // Append
                //span.appendChild(text);
                //div.appendChild(span);
            }
    
            this.e.wordContainer.appendChild(div);
        }
        this.e.hiddenLetters = document.querySelectorAll(".game__content-letter--hidden")
    },

    setCategoryWords: function() {
        let words = JSON.parse(localStorage.getItem('categoryWords'));
        return words[this.getCategory().toLowerCase()];
    },

    removeLSState: function() {
        localStorage.removeItem("categoryWords");
    },

    setState: function() {
        this.gameState.categoryWords = this.setCategoryWords();
        this.gameState.randomWord = this.getRandomWord().toLowerCase();
        this.gameState.hiddenLetters = this.gameState.randomWord.length;
        this.gameState.spacesInword = this.getSpacesInWord();
        this.gameState.hiddenLetters = this.gameState.hiddenLetters - this.gameState.spacesInword;
        this.gameState.hintLetters = this.gameState.randomWord.replace(/\s/g, '').split("");
        this.setWord(this.gameState.randomWord);
    },

    getSpacesInWord: function() {
        let spaces = 0;

        for (let i = 0; i < this.gameState.randomWord.length; i++) {
            if (this.gameState.randomWord[i] === " ") {
                spaces = spaces + 1;
            }
        }

        return spaces;
    },

    guess: function(letterGuess) {
        console.log(this.gameState);
        if (this.gameState.lives !== 0) {
            // Check if the letter to guess is in the randomWord
            if (this.gameState.randomWord.includes(letterGuess)) {
                let newIndices = this.findLetters(letterGuess);

                // Find those letters in the UI and replace them with the letter guess
                this.replaceLetters(newIndices, letterGuess);

                // Run a check to see if hidden letter is 0 and the game is won
                if (this.gameState.hiddenLetters === 0) {
                    alert("You Win!");

                    // Block out all letters from being clickable
                    for (let input of this.e.inputs) {
                        input.style.pointerEvents = "none";
                    }
                }

            } else {
                if (!this.gameState.lettersGuessed.includes(letterGuess)) {
                    this.incorrectLetter(letterGuess);
                }
            }
        }
    },

    findLetters: function(letter) {
        let indicies = [];
        for (let i = 0; i < this.gameState.randomWord.length; i++) {
            if (this.gameState.randomWord[i] === letter) {
                indicies.push(i);
            }
        }

        return indicies;
    },

    replaceLetters: function(indices, letter) {
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

    incorrectLetter: function(letter) {
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

        this.e.hangmanImg.src=`../../src/images/hangman_${this.gameState.lives}.png`;

        if (this.gameState.lives === 0) {
            alert("Game Over! Better Luck Next Time!");

            // Show all the letters in the word
            this.showWord();
        }
    },

    useHint: function() {
        return this.gameState.hintLetters[Math.floor(Math.random() * this.gameState.hintLetters.length)];
    },

    updateHintStatus: function() {
        this.gameState.hints--;
        this.e.hintsBtn.innerHTML = `Hints (${this.gameState.hints})`;
    },

    showWord: function() {
        let randomword = this.gameState.randomWord.split("");
        for (let i = 0; i < this.e.hiddenLetters.length; i++) {
            this.e.hiddenLetters[i].innerHTML = randomword[i];
            this.e.hiddenLetters[i].className = "game__content-letter game__content-letter--shown";
        }
    },

    resetGame: function() {
        // Remove all children from hidden word 
        while (this.e.wordContainer.firstChild) {
            this.e.wordContainer.removeChild(this.e.wordContainer.firstChild);
        }

        // Remove all children from letters guessed
        while (this.e.lettersGuessedCont.firstChild) {
            this.e.lettersGuessedCont.removeChild(this.e.lettersGuessedCont.firstChild);
        }

        this.gameState.hiddenLetters = null;

        this.gameState.lettersGuessed = [];

        this.gameState.lives = 6;

        for (let input of this.e.inputs) {
            input.style.pointerEvents = "";
        }

        this.gameState.hints = 3;

        // Set up State
        this.gameState.category = this.getCategory();
        this.e.categoryTitle.innerHTML = `Category: ${this.gameState.category}`;
        this.e.hintsBtn.innerHTML = `Hints (${this.gameState.hints})`;
        this.e.hangmanImg.src = "../../src/images/hangman_6.png";
        this.saveCategoryWordsLS();
    },

    setListeners: function() {
        for (let input of this.e.inputs) {
            input.addEventListener("click", (e) => {
                this.guess(e.target.innerHTML.toLowerCase());
                input.style.pointerEvents = "none";
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
            this.resetGame();
        });
    },

    init: function() {
        // Set up State
        this.gameState.category = this.getCategory();
        this.e.categoryTitle.innerHTML = `Category: ${this.gameState.category}`;
        this.e.hintsBtn.innerHTML = `Hints (${this.gameState.hints})`;
        this.e.hangmanImg.src = "../../src/images/hangman_6.png";
        this.saveCategoryWordsLS();

        // Add Listeners
        this.setListeners();
    }
};

appManager.init();

const DEV_MODE = false;

if (DEV_MODE) {
    // Refresh When Page Clicked -- DEVELOPMENT MODE --
    window.addEventListener("click", (e) => {
        window.location.reload();
    });
}
