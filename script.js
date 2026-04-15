'use strict';

const App = (() => {

    const STATE = {
        lang: localStorage.getItem('ah_lang') || 'id',
        theme: localStorage.getItem('ah_theme') || 'dark'
    };

    const TRANSLATIONS = {
        id: {
            tagline: "Digital Creator",
            support_heading: "Dukung Karya",
            support_para: "Traktir kopi agar semangat berkarya.",
            copyright: "© {year} A.H 5.1 · Hak Cipta Dilindungi",
            greet_morning: "Selamat Pagi!",
            greet_noon: "Selamat Siang — jangan lupa istirahat.",
            greet_afternoon: "Selamat Sore.",
            greet_night: "Selamat Malam, waktunya rehat."
        },
        en: {
            tagline: "Digital Creator",
            support_heading: "Support My Work",
            support_para: "Buy me a coffee to keep creating.",
            copyright: "© {year} A.H 5.1 · All Rights Reserved",
            greet_morning: "Good Morning!",
            greet_noon: "Good Afternoon!",
            greet_afternoon: "Good Afternoon!",
            greet_night: "Good Evening!"
        },
        ms: {
            tagline: "Pencipta Digital",
            support_heading: "Sokong Saya",
            support_para: "Belanja kopi untuk terus berkarya.",
            copyright: "© {year} A.H 5.1 · Hak Cipta Terpelihara",
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

    // --- Preloader Logic ---
   // --- Preloader Enhanced ---
    const Loader = {
        hide() {
            const percentEl = document.querySelector('.pre-percentage');
            const titleEl = document.querySelector('.pre-title');
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let count = 0;

            // 1. Counter Animation
            const counterInterval = setInterval(() => {
                count++;
                if(percentEl) percentEl.textContent = count.toString().padStart(2, '0') + "%";
                if (count >= 100) clearInterval(counterInterval);
            }, 15);

            // 2. Text Scramble Effect pada Judul
            let iteration = 0;
            const originalText = titleEl.dataset.value;
            const scrambleInterval = setInterval(() => {
                titleEl.innerText = titleEl.innerText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) return originalText[index];
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");
                
                if(iteration >= originalText.length) clearInterval(scrambleInterval);
                iteration += 1 / 3;
            }, 30);

            // 3. Hide Preloader
            window.addEventListener('load', () => {
                setTimeout(() => {
                    DOM.preloader.classList.add('preloader-hidden');
                    // Tambahkan sedikit delay sebelum dihapus dari DOM
                    setTimeout(() => DOM.preloader.remove(), 800);
                }, 2200); // Waktu total simulasi booting
            });
        }
    };

    // --- Greeting based on time ---
    const getGreeting = (lang) => {
        const h = new Date().getHours();
        const t = TRANSLATIONS[lang];
        if (h >= 4 && h < 11) return t.greet_morning;
        if (h >= 11 && h < 15) return t.greet_noon;
        if (h >= 15 && h < 19) return t.greet_afternoon;
        return t.greet_night;
    };

    // --- Language Management ---
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

            // Update active state di tombol
            DOM.langBtns.forEach(btn =>
                btn.classList.toggle('active', btn.dataset.lang === lang)
            );

            const data = TRANSLATIONS[lang];

            // Animasi ulang typewriter text
            if(DOM.typewriter) {
                DOM.typewriter.style.animation = 'none';
                DOM.typewriter.textContent = data.tagline;
                void DOM.typewriter.offsetWidth; // Trigger reflow
                DOM.typewriter.style.animation = 'type-in 1s forwards';
            }

            // Ganti teks elemen lainnya
            DOM.translatables.forEach(el => {
                const key = el.dataset.i18n;
                if (!data[key]) return;
                el.textContent = key === 'copyright'
                    ? data[key].replace('{year}', new Date().getFullYear())
                    : data[key];
            });

            // Update sapaan waktu
            if(DOM.greeting) DOM.greeting.textContent = getGreeting(lang);
        }
    };

    // --- Theme Management ---
    const Theme = {
        init() {
            this.apply(STATE.theme);
            DOM.themeToggle.addEventListener('click', () => {
                this.apply(STATE.theme === 'dark' ? 'light' : 'dark');
            });
        },
        apply(theme) {
            STATE.theme = theme;
            localStorage.setItem('ah_theme', theme);
            DOM.html.setAttribute('data-theme', theme);
            
            // Ganti icon matahari/bulan
            DOM.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
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
