const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const navbarLogo = document.getElementById('navbar-logo');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const topNavbar = document.querySelector('.top-navbar');

function applyTheme(theme, persist = false) {
    const isDark = theme === 'dark';
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    if (themeIcon) {
        themeIcon.src = isDark ? './icon/sun.svg' : './icon/moon.svg';
        themeIcon.alt = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
    if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (navbarLogo) {
        navbarLogo.src = isDark ? './images/easyvo-dark-mode-logo.jpg' : './images/easyvo-light-mode-logo.jpg';
    }
    if (persist) {
        try {
            localStorage.setItem('app-theme', theme);
        } catch (error) {
            // Theme still applies when storage is unavailable.
        }
    }
}

let savedTheme = null;
try {
    savedTheme = localStorage.getItem('app-theme');
} catch (error) {
    savedTheme = null;
}

const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(preferredTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme, true);
    });
}

if (mobileMenuToggle && topNavbar) {
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = topNavbar.classList.toggle('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            topNavbar.classList.remove('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') {
            return;
        }
        const target = document.querySelector(targetId);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
