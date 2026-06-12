const yearNode = document.getElementById("year");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("siteNav");
const downloadButton = document.getElementById("downloadButton");

if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
}

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const open = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(open));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

if (downloadButton) {
    downloadButton.addEventListener("click", (event) => {
        if (downloadButton.getAttribute("href") === "#") {
            event.preventDefault();
            window.alert("Поки що тут немає реального файла. Пізніше підставите сюди посилання на .exe.");
        }
    });
}
