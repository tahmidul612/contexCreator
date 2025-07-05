function swapIcon() {
    const icon = document.getElementById('theme-icon');
    const isDark = document.documentElement.classList.contains('dark');
    icon.innerHTML = isDark
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
           d="M17.293 14.293A8 8 0 019.707 6.707a8.001 8.001 0 107.586 7.586z"/>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
           d="M12 4v2m0 12v2m8-8h2M4 12H2m15.36 6.36l1.42 1.42M6.34 6.34l-1.42-1.42m0 13.44l1.42-1.42M17.66 6.34l-1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z"/>`;
  }

  // Handle form submission
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('input-form');
    const input = document.getElementById('userInput');
    const responseBox = document.getElementById('responseBox');
    const responseText = document.getElementById('responseText');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (value) {
        responseText.textContent = `You entered: ${value}`;
        responseBox.classList.remove('hidden');
      } else {
        responseText.textContent = `Please enter something!`;
        responseBox.classList.remove('hidden');
      }
    });
  });