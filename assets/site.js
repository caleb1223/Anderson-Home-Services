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

// Short closures and adjusted hours appear 4 weeks ahead; 3+ day breaks, 12 weeks.
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
  const dayMs = 24 * 60 * 60 * 1000;
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric'
  });
  const range = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric'
  });
  document.getElementById('schedule-range').textContent = 'Eastern time';
  // Group before filtering: a long break remains one block even near its end.
  const blocks = [];
  for (const date of Object.keys(exceptions).sort()) {
    const day = new Date(`${date}T00:00:00Z`);
    const previous = blocks.at(-1);
    if (exceptions[date] === 'Closed' && previous?.hours === 'Closed' &&
        day.getTime() - previous.end.getTime() === dayMs) {
      previous.end = day;
    } else {
      blocks.push({ start: day, end: day, hours: exceptions[date] });
    }
  }
  schedule.replaceChildren();
  for (const block of blocks) {
    const days = (block.end - block.start) / dayMs + 1;
    const horizon = days >= 3 ? 84 : 28;
    if (block.end < today || block.start - today > horizon * dayMs) continue;
    let changesTypicalHours = false;
    for (let day = Math.max(block.start.getTime(), today.getTime()); day <= block.end.getTime(); day += dayMs) {
      if (block.hours !== weekly[new Date(day).getUTCDay()]) changesTypicalHours = true;
    }
    if (!changesTypicalHours) continue;
    const row = document.createElement('li');
    const heading = document.createElement('strong');
    heading.textContent = days === 1 ? `${label.format(block.start)}: ` :
      `${range.format(block.start)} – ${range.format(block.end)}: `;
    row.dataset.date = block.start.toISOString().slice(0, 10);
    row.dataset.endDate = block.end.toISOString().slice(0, 10);
    row.append(heading, block.hours);
    schedule.append(row);
  }
  if (!schedule.children.length) {
    const row = document.createElement('li');
    row.textContent = 'No upcoming schedule changes to show.';
    schedule.append(row);
  }
  const disclosure = document.getElementById('upcoming-hours');
  const revealSchedule = () => {
    if (location.hash === '#upcoming-hours') disclosure.open = true;
  };
  revealSchedule();
  window.addEventListener('hashchange', revealSchedule);
}
