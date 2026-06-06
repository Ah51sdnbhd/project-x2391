'use strict';

const App = (() => {

    const STATE = {
        lang: localStorage.getItem('ah_lang') || 'id',
        theme: localStorage.getItem('ah_theme') || 'dark'
    };

    const TRANSLATIONS = {
        id: {
            tagline: "peminat teknologi",
            support_heading: "Dukung Karya",
            support_para: "Traktir kopi agar semangat berkarya.",
            copyright: "© A.H 5.1 · Hak Cipta Dilindungi",
            greet_morning: "Selamat Pagi!",
            greet_noon: "Selamat Siang!",
            greet_afternoon: "Selamat Sore.",
            greet_night: "Selamat Malam!"
        },
        en: {
            tagline: "Tech Enthusiast",
            support_heading: "Support My Work",
            support_para: "Buy me a coffee to keep creating.",
            copyright: "© A.H 5.1 · All Rights Reserved",
            greet_morning: "Good Morning!",
            greet_noon: "Good Afternoon!",
            greet_afternoon: "Good Afternoon!",
            greet_night: "Good Evening!"
        },
        ms: {
            tagline: "peminat teknologi",
            support_heading: "Sokong Saya",
            support_para: "Belanja kopi untuk terus berkarya.",
            copyright: "© A.H 5.1 · Hak Cipta Terpelihara",
            greet_morning: "Selamat Pagi!",
            greet_noon: "Selamat Tengahari!",
            greet_afternoon: "Selamat Petang!",
            greet_night: "Selamat Malam!"
        }
    };

    // --- DOM Cache ---
    const DOM = {
        html: document.documentElement,
        preloader: document.getElementById('preloader'),
        greeting: document.getElementById('greeting-text'),
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.querySelector('#theme-toggle i'),
        langBtns: document.querySelectorAll('.lang-btn'),
        typewriter: document.querySelector('.typewriter'),
        translatables: document.querySelectorAll('[data-i18n]')
    };

    // --- Preloader Driver ---
    const Loader = {
        hide() {
            const percentEl = document.querySelector('.pre-percentage');
            const progressBar = document.querySelector('.pre-progress-bar');
            let count = 0;

            const counterInterval = setInterval(() => {
                count++;
                if (percentEl) percentEl.textContent = count.toString().padStart(2, '0') + "%";
                if (progressBar) progressBar.style.width = count + "%";
                
                if (count >= 100) {
                    clearInterval(counterInterval);
                    this.dismiss();
                }
            }, 12);
        },
        dismiss() {
            if (DOM.preloader) {
                DOM.preloader.classList.add('preloader-hidden');
                setTimeout(() => {
                    if (DOM.preloader) DOM.preloader.remove();
                }, 800);
            }
        }
    };

    // --- Greeting System ---
    const getGreeting = (lang) => {
        const h = new Date().getHours();
        const t = TRANSLATIONS[lang];
        if (h >= 4 && h < 11) return t.greet_morning;
        if (h >= 11 && h < 15) return t.greet_noon;
        if (h >= 15 && h < 19) return t.greet_afternoon;
        return t.greet_night;
    };

    // --- Language Controller ---
    const Content = {
        init() {
            this.apply(STATE.lang);
            DOM.langBtns.forEach(btn => {
                btn.addEventListener('click', () => this.apply(btn.dataset.lang));
            });
        },
        apply(lang) {
            if (!TRANSLATIONS[lang]) return;
            STATE.lang = lang;
            localStorage.setItem('ah_lang', lang);
            DOM.html.setAttribute('lang', lang);

            DOM.langBtns.forEach(btn =>
                btn.classList.toggle('active', btn.dataset.lang === lang)
            );

            const data = TRANSLATIONS[lang];

            DOM.translatables.forEach(el => {
                const key = el.dataset.i18n;
                if (!data[key]) return;
                el.textContent = key === 'copyright'
                    ? data[key].replace('{year}', new Date().getFullYear())
                    : data[key];
            });

            if (DOM.greeting) DOM.greeting.textContent = getGreeting(lang);
        }
    };

    // --- Theme Controller ---
    const Theme = {
        init() {
            this.apply(STATE.theme);
            if (DOM.themeToggle) {
                DOM.themeToggle.addEventListener('click', () => {
                    this.apply(STATE.theme === 'dark' ? 'light' : 'dark');
                });
            }
        },
        apply(theme) {
            STATE.theme = theme;
            localStorage.setItem('ah_theme', theme);
            DOM.html.setAttribute('data-theme', theme);
            if (DOM.themeIcon) {
                DOM.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    };

    return {
        start() {
            Loader.hide();
            Content.init();
            Theme.init();
        }
    };

})();

document.addEventListener('DOMContentLoaded', App.start);
