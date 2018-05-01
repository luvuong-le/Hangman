const loader = document.getElementById("loader");
const main = document.getElementById("section-main");

// On Window Load
window.addEventListener("load", (e) => {
    setTimeout(() => {
        loader.classList.add("loader__hidden");
    }, 100);

    main.classList.remove("main--hidden");});

sessionStorage.removeItem("refreshed");