
'use strict';

const App = (() => {

    const STATE = {
        lang: localStorage.getItem('ah_lang') || 'id',
        theme: localStorage.getItem('ah_theme') || 'dark'
    };

    const TRANSLATIONS = {
        id: {
            tagline: "Kreator Konten & Tech Enthusiast",
            support_heading: "Dukung Karya Saya",
            support_para: "Traktir kopi agar saya semangat.",
            copyright: "© {year} A.H 5.1 | Hak Cipta Dilindungi",
            greet_morning: "Selamat Pagi!",
            greet_noon: "Selamat Siang, jangan lupa makan.",
            greet_afternoon: "Selamat Sore.",
            greet_night: "Selamat Malam, istirahat yang cukup."
        },
        en: {
            tagline: "Digital Creator & Tech Enthusiast",
            support_heading: "Support My Work",
            support_para: "Buy me a coffee to keep creating.",
            copyright: "© {year} A.H 5.1 | All rights reserved",
            greet_morning: "Good Morning!",
            greet_noon: "Good Afternoon!",
            greet_afternoon: "Good Afternoon!",
            greet_night: "Good Evening!"
        },
        ms: {
            tagline: "Pencipta Digital & Peminat Tech",
            support_heading: "Sokong Saya",
            support_para: "Belanja saya kopi untuk terus berkarya.",
            copyright: "© {year} A.H 5.1 | Hak cipta terpelihara",
            greet_morning: "Selamat Pagi!",
            greet_noon: "Selamat Tengahari!",
            greet_afternoon: "Selamat Petang!",
            greet_night: "Selamat Malam!"
        }
    };

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

    const UI = {
        init() {
            // Remove preloader
            window.addEventListener('load', () => {
                setTimeout(() => {
                    DOM.preloader.style.opacity = '0';
                    setTimeout(() => DOM.preloader.remove(), 500);
                }, 800);
            });

            // Tilt Effect for Desktop only
            const card = document.querySelector('.js-tilt-card');
            if(window.innerWidth > 800) {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -2; // Micro tilt
                    const rotateY = ((x - centerX) / centerX) * 2;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                });
            }
        },

        updateGreeting() {
            const h = new Date().getHours();
            const keys = TRANSLATIONS[STATE.lang];
            let text = "";

            if (h >= 4 && h < 11) text = keys.greet_morning;
            else if (h >= 11 && h < 15) text = keys.greet_noon;
            else if (h >= 15 && h < 19) text = keys.greet_afternoon;
            else text = keys.greet_night;

            DOM.greeting.textContent = text;
        }
    };

    const Content = {
        init() {
            this.setLang(STATE.lang);
            
            DOM.langBtns.forEach(btn => {
                btn.addEventListener('click', () => this.setLang(btn.dataset.lang));
            });
        },

        setLang(lang) {
            if(!TRANSLATIONS[lang]) return;
            STATE.lang = lang;
            localStorage.setItem('ah_lang', lang);
            DOM.html.setAttribute('lang', lang); // Important for fonts/SEO

            // Update Buttons
            DOM.langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

            // Update Text
            const data = TRANSLATIONS[lang];
            
            // Typewriter reset
            DOM.typewriter.style.animation = 'none';
            DOM.typewriter.textContent = data.tagline;
            setTimeout(() => DOM.typewriter.style.animation = '', 10);

            // General keys
            DOM.translatables.forEach(el => {
                const key = el.dataset.i18n;
                if(data[key]) {
                    if(key === 'copyright') el.textContent = data[key].replace('{year}', new Date().getFullYear());
                    else el.textContent = data[key];
                }
            });

            UI.updateGreeting();
        }
    };

    const Theme = {
        init() {
            this.apply(STATE.theme);
            DOM.themeToggle.addEventListener('click', () => {
                const newTheme = STATE.theme === 'dark' ? 'light' : 'dark';
                this.apply(newTheme);
            });
        },
        apply(theme) {
            STATE.theme = theme;
            localStorage.setItem('ah_theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            DOM.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    };

    return {
        start: () => {
            UI.init();
            Content.init();
            Theme.init();
        }
    };
})();

document.addEventListener('DOMContentLoaded', App.start);
