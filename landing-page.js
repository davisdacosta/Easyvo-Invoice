 // --- THEME TOGGLE ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const navbarLogo = document.getElementById('navbar-logo');

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.src = './icon/sun.svg';
      themeIcon.alt = 'Switch to light mode';
      navbarLogo.src = './images/easyvo-dark-mode-logo.jpg';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.src = './icon/moon.svg';
      themeIcon.alt = 'Switch to dark mode';
      navbarLogo.src = './images/easyvo-light-mode-logo.jpg';
    }
    try { localStorage.setItem('app-theme', theme); } catch (e) { /* ignore */ }
  }

  // Toggle theme on button click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const currentTheme = getCurrentTheme();
      applyTheme(currentTheme === 'light' ? 'dark' : 'light');
      renderPreview();
    });
  }

  // Apply saved preference or system preference on load
  try {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  } catch (e) {
    applyTheme('light');
  }

  renderPreview();