let appManager = {

    gameState: {
        category: "",
        categoryWords: null,
        randomWord: "",
    },

    e: {
        wordContainer: document.getElementById("game__content-word"),
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
            div.className = "game__content-letter game__content-letter--hidden";

            let span = document.createElement("span");
            span.className = "game__content-letter-text";
            let text = document.createTextNode(word.charAt(i));

            // Append
            span.appendChild(text);
            div.appendChild(span);
            this.e.wordContainer.appendChild(div);
        }
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
        this.gameState.randomWord = this.getRandomWord();
        this.setWord(this.gameState.randomWord);
    },

    init: function() {
        this.gameState.category = this.getCategory();
        this.saveCategoryWordsLS();
    }
};

appManager.init();

const DEV_MODE = true;

if (DEV_MODE) {
    // Refresh When Page Clicked -- DEVELOPMENT MODE --
    window.addEventListener("click", (e) => {
        window.location.reload();
    });
}
