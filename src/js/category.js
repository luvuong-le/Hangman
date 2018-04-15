let categoryManager = {
    e: {
        categories: document.querySelectorAll('.category'),
    },

    setListeners: function() {
        for(let category of this.e.categories) {
            category.addEventListener("click", () => {
                localStorage.setItem("category", category.innerHTML);
            });
        }
    }
}

categoryManager.setListeners();