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

// Show only changes to typical hours through the end of the following week.
// UTC dates below represent calendar days, avoiding daylight-saving arithmetic.
const schedule = document.getElementById('operating-schedule');
if (schedule) {
  const weekly = JSON.parse(schedule.dataset.weeklyHours);
  const exceptions = JSON.parse(schedule.dataset.hoursExceptions);
  const eastern = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const part = (name) => eastern.find(p => p.type === name).value;
  const today = new Date(`${part('year')}-${part('month')}-${part('day')}T00:00:00Z`);
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() + (7 - today.getUTCDay()) % 7 + 7);
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric'
  });
  const range = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric'
  });
  document.getElementById('schedule-range').textContent =
    `${range.format(today)} – ${range.format(end)} · Eastern time`;
  schedule.replaceChildren();
  for (const day = new Date(today); day <= end; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10);
    if (!Object.hasOwn(exceptions, date) || exceptions[date] === weekly[day.getUTCDay()]) continue;
    const row = document.createElement('li');
    const heading = document.createElement('strong');
    heading.textContent = `${label.format(day)}: `;
    row.dataset.date = date;
    row.append(heading, exceptions[date]);
    schedule.append(row);
  }
  if (!schedule.children.length) {
    const row = document.createElement('li');
    row.textContent = 'No changes to my typical hours.';
    schedule.append(row);
  }
  const disclosure = document.getElementById('upcoming-hours');
  const revealSchedule = () => {
    if (location.hash === '#upcoming-hours') disclosure.open = true;
  };
  revealSchedule();
  window.addEventListener('hashchange', revealSchedule);
}
