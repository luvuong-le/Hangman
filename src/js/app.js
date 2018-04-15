let appManager = {

    gameState: {
        category: "",
        categoryWords: null,
        randomWord: "",
        hiddenLetters: null,
        hints: 3,
        lettersGuessed: [],
        spacesInword: null,
    },

    e: {
        wordContainer: document.getElementById("game__content-word"),
        lettersGuessedCont: document.getElementById("game__content-letter-guessed-cont"),
        inputs: document.querySelectorAll(".game__content-letter--input"),
        hiddenLetters: null
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
        // Check if the letter to guess is in the randomWord
        if (this.gameState.randomWord.includes(letterGuess)) {
            let newIndices = this.findLetters(letterGuess);

            // Find those letters in the UI and replace them with the letter guess
            this.replaceLetters(newIndices, letterGuess);
        } else {
            if (!this.gameState.lettersGuessed.includes(letterGuess)) {
                this.incorrectLetter(letterGuess);
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
    },

    setListeners: function() {
        for (let input of this.e.inputs) {
            input.addEventListener("click", (e) => {
                this.guess(e.target.innerHTML.toLowerCase());
            })
        }
    },

    init: function() {
        // Set up State
        this.gameState.category = this.getCategory();
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
