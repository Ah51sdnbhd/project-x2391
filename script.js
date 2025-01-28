// file: script.js
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Cek tema sebelumnya dari localStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
}

// Toggle tema saat tombol diklik
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');

    // Perbarui teks dan ikon tombol
    if (body.classList.contains('dark')) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        localStorage.setItem('theme', 'light');
    }
});
