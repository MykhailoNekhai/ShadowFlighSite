const yearNode = document.getElementById("year");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("siteNav");
const languageButtons = document.querySelectorAll("[data-language]");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-toggle__label");
const musicToggle = document.querySelector(".music-toggle");
const musicToggleLabel = document.querySelector(".music-toggle__label");
const bgMusic = document.getElementById("bgMusic");
const downloadButton = document.getElementById("downloadButton");
const trailerPlay = document.getElementById("trailerPlay");
const revealNodes = document.querySelectorAll(".reveal");
const particleHost = document.getElementById("particles");
const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const storageKeyTheme = "shadow-flight-theme";
const storageKeyLanguage = "shadow-flight-language";
const storageKeyMusicMuted = "shadow-flight-music-muted";
let currentTheme = localStorage.getItem(storageKeyTheme) || root.getAttribute("data-theme") || "ember";
let currentLanguage = localStorage.getItem(storageKeyLanguage) || "en";
let musicMuted = localStorage.getItem(storageKeyMusicMuted) === "true";

const translations = {
    en: {
        nav: {
            about: "About",
            gameplay: "Gameplay",
            features: "Features",
            status: "Status",
            contact: "Contact"
        },
        common: {
            download: "Download"
        },
        sound: {
            mute: "On",
            on: "Off"
        },
        hero: {
            eyebrow: "Dark fantasy side-scrolling adventure",
            title: "Shadow Flight",
            tagline: "Fly through the dark. Survive what follows.",
            text: "Enter a world where light is fading, every path is dangerous, and every second matters. You control a mysterious shadow creature trying to escape a hostile land full of ruins, traps, thorns, moving mechanisms, and hidden dangers.",
            ctaTrailer: "Watch Trailer",
            ctaDownload: "Download"
        },
        trailer: {
            label: "Watch The Gameplay · Coming soon",
            alert: "The trailer is not ready yet. Check back soon."
        },
        about: {
            eyebrow: "About The Game",
            visualLabel: "atmospheric levels",
            textOne: "ShadowFlight is a dark atmospheric platformer built around movement, timing, and survival. You fly through hand-crafted levels filled with deadly obstacles, strange power-ups, and unpredictable physics-based challenges.",
            textTwo: "The game is simple to understand, but every level pushes you harder. Sometimes you need patience. Sometimes you need speed. Sometimes one mistake is enough to lose everything. The deeper you go, the darker and more dangerous the world becomes.",
            textThree: "Use power-ups to clone yourself, change size, speed up, slow down, and survive situations that look impossible at first. Play alone or join a friend in co-op mode and face the darkness together."
        },
        gameplay: {
            eyebrow: "Gameplay",
            visualLabel: "ways to die",
            title: "Fly, dodge, react, and adapt.",
            textOne: "ShadowFlight is not only about reaching the end of the level — it is about surviving the journey. Each stage introduces new hazards, new rhythms, and new ways to test your control.",
            textTwo: "The game rewards precision, timing, and quick thinking. Every trap has a pattern. Every obstacle has a way through. You just have to find it before the darkness catches you."
        },
        features: {
            eyebrow: "Features",
            one: "20 atmospheric levels",
            two: "dark fantasy world with ruins, thorns, traps, and dangerous machines",
            three: "physics-based movement and challenging level design",
            four: "power-ups: clone, grow, shrink, speed up, and slow down",
            five: "solo mode and co-op gameplay",
            six: "achievements and player statistics",
            seven: "character customization",
            eight: "immersive sound and dark visual atmosphere"
        },
        status: {
            eyebrow: "Development status",
            title: "Currently in development.",
            text: "Shadow Flight is focused on atmosphere, movement, level danger, and immersive world-building. The current direction prioritizes a strong playable mood before content scale."
        },
        download: {
            eyebrow: "Prototype access",
            title: "Ready to enter the darkness?",
            text: "Download ShadowFlight and begin your flight through a world built to stop you.",
            button: "Prototype",
            note: "Current action: placeholder only, no build attached yet.",
            alert: "No build is attached yet. Replace this placeholder with your real download link later."
        },
        sysreqs: {
            eyebrow: "System Requirements",
            minimum: "Minimum",
            recommended: "Recommended",
            os: "OS",
            cpu: "CPU",
            ram: "RAM",
            gpu: "GPU",
            storage: "Storage",
            display: "Display",
            java: "Java",
            internet: "Internet"
        },
        fab: {
            leaderboard: "Leaderboard"
        },
        footer: {
            title: "Shadow Flight",
            copy: "Have questions, feedback, or want to contact the developer? Reach out through the links below.",
            trailer: "Trailer",
            legal: "Shadow Flight. All rights reserved."
        }
    },
    uk: {
        nav: {
            about: "Про гру",
            gameplay: "Геймплей",
            features: "Особливості",
            status: "Статус",
            contact: "Контакти"
        },
        common: {
            download: "Завантажити"
        },
        sound: {
            mute: "On",
            on: "Off"
        },
        hero: {
            eyebrow: "Темний атмосферний платформер",
            title: "Shadow Flight",
            tagline: "Лети крізь темряву. Вижи те, що слідує за тобою.",
            text: "Світ, де світло згасає, кожен шлях небезпечний, а кожна секунда має значення. Ти керуєш таємничою тіньовою істотою, яка намагається втекти з ворожої землі, повної руїн, пасток, шипів, рухомих механізмів і прихованих небезпек.",
            ctaTrailer: "Дивитися трейлер",
            ctaDownload: "Завантажити"
        },
        trailer: {
            label: "Дивитися геймплей · Незабаром",
            alert: "Трейлер ще не готовий. Повертайся пізніше."
        },
        about: {
            eyebrow: "Про гру",
            visualLabel: "атмосферні рівні",
            textOne: "ShadowFlight — це темний атмосферний платформер, побудований навколо руху, таймінгу та виживання. Ти летиш крізь рукотворні рівні, повні смертельних перешкод, дивних поліпшень і непередбачуваних фізичних викликів.",
            textTwo: "Гра проста для розуміння, але кожен рівень тисне все сильніше. Іноді потрібна терпеливість. Іноді — швидкість. Іноді одна помилка означає втрату всього. Чим глибше заходиш, тим темніший і небезпечніший світ.",
            textThree: "Використовуй поліпшення, щоб клонувати себе, змінювати розмір, прискорюватись, сповільнюватись і виживати в ситуаціях, що здаються неможливими. Грай сам або з другом у кооп-режимі."
        },
        gameplay: {
            eyebrow: "Геймплей",
            visualLabel: "способів загинути",
            title: "Лети, ухиляйся, реагуй і адаптуйся.",
            textOne: "ShadowFlight — це не лише про досягнення кінця рівня, а про те, щоб вижити у дорозі. Кожен етап вводить нові небезпеки, нові ритми і нові способи перевірити твій контроль.",
            textTwo: "Гра винагороджує точність, таймінг і швидке мислення. Кожна пастка має патерн. Кожна перешкода має вихід. Тобі лише треба знайти його до того, як темрява тебе наздожене."
        },
        features: {
            eyebrow: "Особливості",
            one: "20 атмосферних рівнів",
            two: "темний фентезійний світ з руїнами, шипами, пастками і небезпечними машинами",
            three: "фізичний рух і складний дизайн рівнів",
            four: "поліпшення: клон, збільшення, зменшення, прискорення та сповільнення",
            five: "одиночний режим і кооп",
            six: "досягнення та статистика гравців",
            seven: "кастомізація персонажа",
            eight: "атмосферний звук і темна візуальна атмосфера"
        },
        status: {
            eyebrow: "Статус розробки",
            title: "Наразі в розробці.",
            text: "Shadow Flight зосереджений на атмосфері, русі, небезпеці рівнів та занурювальному світобудуванні. Поточний напрям пріоритезує сильний ігровий настрій ще до масштабування контенту."
        },
        download: {
            eyebrow: "Доступ до прототипу",
            title: "Готовий увійти в темряву?",
            text: "Завантаж ShadowFlight і почни свій політ крізь світ, побудований щоб зупинити тебе.",
            button: "Прототип",
            note: "Поточна дія: лише заглушка, реальний білд ще не прикріплено.",
            alert: "Білд ще не прикріплено. Пізніше заміни цю заглушку на реальне посилання для завантаження."
        },
        sysreqs: {
            eyebrow: "Системні вимоги",
            minimum: "Мінімум",
            recommended: "Рекомендовано",
            os: "ОС",
            cpu: "ЦП",
            ram: "ОЗП",
            gpu: "ВК",
            storage: "Пам'ять",
            display: "Екран",
            java: "Java",
            internet: "Інтернет"
        },
        fab: {
            leaderboard: "Таблиця лідерів"
        },
        footer: {
            title: "Shadow Flight",
            copy: "Є питання, відгуки або хочеш зв'язатись з розробником? Пиши через посилання нижче.",
            trailer: "Трейлер",
            legal: "Shadow Flight. Усі права захищено."
        }
    }
};

const getValueByPath = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);

const applyTheme = (theme) => {
    currentTheme = theme === "ivory" ? "ivory" : "ember";
    root.setAttribute("data-theme", currentTheme);
    localStorage.setItem(storageKeyTheme, currentTheme);

    if (themeLabel) {
        themeLabel.textContent = currentTheme === "ivory" ? "Ivory" : "Ember";
    }

    if (themeToggle) {
        themeToggle.setAttribute("aria-label", currentTheme === "ivory" ? "Switch to Ember mode" : "Switch to Ivory mode");
    }
};

const applyMusicState = (muted) => {
    musicMuted = Boolean(muted);
    localStorage.setItem(storageKeyMusicMuted, String(musicMuted));

    if (bgMusic) {
        bgMusic.muted = musicMuted;

        if (musicMuted) {
            bgMusic.pause();
        } else if (bgMusic.dataset.started === "true") {
            bgMusic.play().catch(() => {});
        } else {
            startBackgroundMusic();
        }
    }

    const dictionary = translations[currentLanguage] || translations.en;

    const label = musicMuted ? dictionary.sound.on : dictionary.sound.mute;

    if (musicToggleLabel) {
        musicToggleLabel.textContent = label;
    }

    if (musicToggle) {
        musicToggle.setAttribute("aria-label", label);
        musicToggle.classList.toggle("is-muted", musicMuted);
    }
};

const startBackgroundMusic = async () => {
    if (!bgMusic || bgMusic.dataset.started === "true" || musicMuted) {
        return;
    }

    bgMusic.volume = 0.25;
    bgMusic.playbackRate = 1;

    try {
        await bgMusic.play();
        bgMusic.dataset.started = "true";
    } catch {
        // Browsers may block autoplay until the first user gesture.
    }
};

const applyLanguage = (language) => {
    currentLanguage = language === "uk" ? "uk" : "en";
    const dictionary = translations[currentLanguage];

    root.lang = currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
        const value = getValueByPath(dictionary, node.getAttribute("data-i18n") || "");

        if (typeof value === "string") {
            node.textContent = value;
        }
    });

    languageButtons.forEach((button) => {
        button.classList.toggle("is-active", button.getAttribute("data-language") === currentLanguage);
    });

    localStorage.setItem(storageKeyLanguage, currentLanguage);
    applyMusicState(musicMuted);
};

if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
}

applyTheme(currentTheme);
applyLanguage(currentLanguage);
applyMusicState(musicMuted);
startBackgroundMusic();

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

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        applyTheme(currentTheme === "ember" ? "ivory" : "ember");
        startBackgroundMusic();
    });
}

if (musicToggle) {
    musicToggle.addEventListener("click", () => {
        applyMusicState(!musicMuted);
    });
}

languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        applyLanguage(button.getAttribute("data-language") || "en");
    });
});

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px"
    });

    revealNodes.forEach((node) => observer.observe(node));
} else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if (trailerPlay) {
    trailerPlay.addEventListener("click", () => {
        window.alert(translations[currentLanguage].trailer.alert);
    });
}

if (downloadButton) {
    downloadButton.addEventListener("click", (event) => {
        if (downloadButton.getAttribute("href") !== "#") {
            return;
        }

        event.preventDefault();
        window.alert(translations[currentLanguage].download.alert);
    });
}

["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, startBackgroundMusic, { once: true, passive: true });
});

const backToTopBtn = document.getElementById("backToTop");

const onScrollFabs = () => {
    backToTopBtn?.classList.toggle("is-visible", window.scrollY > 300);
};

window.addEventListener("scroll", onScrollFabs, { passive: true });
onScrollFabs();

backToTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const createParticles = () => {
    if (!particleHost || reduceMotion) {
        return;
    }

    const particleCount = window.innerWidth < 768 ? 18 : 30;

    for (let index = 0; index < particleCount; index += 1) {
        const particle = document.createElement("span");
        const size = `${(Math.random() * 5 + 2).toFixed(2)}px`;

        particle.style.setProperty("--size", size);
        particle.style.setProperty("--left", `${Math.random() * 100}%`);
        particle.style.setProperty("--top", `${Math.random() * 100}%`);
        particle.style.setProperty("--duration", `${12 + Math.random() * 18}s`);
        particle.style.setProperty("--delay", `${Math.random() * -14}s`);

        particleHost.appendChild(particle);
    }
};

const updateAtmosphere = () => {
    if (reduceMotion) {
        return;
    }

    const scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4);
    root.style.setProperty("--forest-shift", `${scrollProgress * 28}px`);
    root.style.setProperty("--glow-shift", `${scrollProgress * -10}px`);
    root.style.setProperty("--fog-y", `${scrollProgress * 18}px`);
};

const handlePointerMove = (event) => {
    if (reduceMotion) {
        return;
    }

    const offsetX = event.clientX / window.innerWidth - 0.5;
    const offsetY = event.clientY / window.innerHeight - 0.5;

    root.style.setProperty("--glow-shift", `${offsetX * 24}px`);
    root.style.setProperty("--fog-x", `${offsetX * 26}px`);
    root.style.setProperty("--fog-y", `${offsetY * 18}px`);
};

createParticles();
updateAtmosphere();

if (!reduceMotion) {
    window.addEventListener("scroll", updateAtmosphere, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
}
