// Shared navigation; native FAQ disclosures do not require JavaScript.
document.querySelectorAll('.hamburger[aria-controls]').forEach((button) => {
  const menu = document.getElementById(button.getAttribute('aria-controls'));
  if (!menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  button.closest('nav').addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
  // Follow each page's existing breakpoint, including Service Areas.
  window.addEventListener('resize', () => {
    if (getComputedStyle(button).display === 'none') setOpen(false);
  });
});
