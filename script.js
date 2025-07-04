const quotes = [
  "Believe you can and you're halfway there.", "Every day is a fresh start.",
  "Small steps every day.", "Stay positive, work hard, make it happen.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Dream big. Start small. Act now.", "You are capable of amazing things.",
  "Progress, not perfection.", "Don’t watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started."
];

const getDateArray = (start, end) => {
  const arr = [], dt = new Date(start);
  while (dt <= end) arr.push(new Date(dt)), dt.setDate(dt.getDate() + 1);
  return arr;
};

const formatDate = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const getDayName = d => d.toLocaleDateString('en-GB', { weekday: 'short' });

let selectedDayIdx = null, daysArray = [], sideDaysOffset = 0, miniCalMonth = 0, miniCalYear = 2025, tasksPerDay = {};

function saveTasks() {
  localStorage.setItem('calendarTasks2025', JSON.stringify(tasksPerDay));
}

function loadTasks() {
  const data = localStorage.getItem('calendarTasks2025');
  if (data) tasksPerDay = JSON.parse(data);
}

function generateDaysLayout(idx = null, offset = sideDaysOffset) {
  const start = new Date(2025, 0, 1), end = new Date(2025, 11, 31);
  daysArray = getDateArray(start, end);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  selectedDayIdx = idx ?? daysArray.findIndex(d => d.getTime() === today.getTime());
  if (selectedDayIdx === -1) selectedDayIdx = 0;

  const currentDay = daysArray[selectedDayIdx], sideDays = document.getElementById('side-days');
  const total = 10, startIdx = Math.max(0, selectedDayIdx - 5 + offset);
  let endIdx = Math.min(daysArray.length, startIdx + total);
  if (endIdx - startIdx < total) sideDaysOffset = Math.max(0, endIdx - total) - (selectedDayIdx - 5);
  else sideDaysOffset = startIdx - (selectedDayIdx - 5);

  sideDays.innerHTML = '';
  const navBtn = (text, offsetChange, disable) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cursor = 'pointer';
    btn.disabled = disable;
    btn.onclick = () => generateDaysLayout(selectedDayIdx, sideDaysOffset + offsetChange);
    return btn;
  };
  sideDays.appendChild(navBtn('←', -10, startIdx === 0));

  for (let i = startIdx; i < endIdx; i++) {
    const d = daysArray[i], card = document.createElement('div');
    card.className = 'side-day-card';
    card.innerHTML = `<div><strong>${getDayName(d)}, ${formatDate(d)}</strong></div>`;
    if (i === selectedDayIdx) Object.assign(card.style, { background: '#1976d2', color: '#fff', fontWeight: 'bold' });
    card.style.cursor = 'pointer';
    card.onclick = () => generateDaysLayout(i, sideDaysOffset);
    sideDays.appendChild(card);
  }

  sideDays.appendChild(navBtn('→', 10, endIdx >= daysArray.length));

  const current = document.getElementById('current-day');
  current.innerHTML = '';
  if (currentDay) {
    const card = document.createElement('div');
    card.className = 'current-day-card';

    let quoteDiv = document.getElementById('motivational-quote');
    if (!quoteDiv) {
      quoteDiv = document.createElement('div');
      quoteDiv.id = 'motivational-quote';
      quoteDiv.className = 'quote';
    }
    card.appendChild(quoteDiv);

    const taskInputWrapper = document.createElement('div');
    taskInputWrapper.style.display = 'flex';
    taskInputWrapper.style.gap = '0.5rem';
    taskInputWrapper.style.flexDirection = 'column';

    const taskTitleInput = document.createElement('input');
    taskTitleInput.type = 'text';
    taskTitleInput.placeholder = 'Task title...';
    taskTitleInput.id = 'task-title';

    const taskDescInput = document.createElement('input');
    taskDescInput.type = 'text';
    taskDescInput.placeholder = 'Task description...';
    taskDescInput.id = 'task-desc';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.id = 'add-task';
    addBtn.style.padding = '0.3rem 1rem';
    addBtn.style.background = '#1976d2';
    addBtn.style.color = '#fff';
    addBtn.style.border = 'none';
    addBtn.style.borderRadius = '4px';
    addBtn.style.cursor = 'pointer';

    const addEverydayBtn = document.createElement('button');
    addEverydayBtn.textContent = 'Add to Everyday Task';
    addEverydayBtn.id = 'add-everyday-task';
    addEverydayBtn.style.padding = '0.3rem 1rem';
    addEverydayBtn.style.background = '#43a047';
    addEverydayBtn.style.color = '#fff';
    addEverydayBtn.style.border = 'none';
    addEverydayBtn.style.borderRadius = '4px';
    addEverydayBtn.style.cursor = 'pointer';
    addEverydayBtn.style.marginTop = '0.3rem';

    const endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.id = 'everyday-end-date';
    endDateInput.style.marginBottom = '0.5rem';
    endDateInput.style.marginRight = '0.5rem';

    taskInputWrapper.appendChild(taskTitleInput);
    taskInputWrapper.appendChild(taskDescInput);
    taskInputWrapper.appendChild(addBtn);

    const everydayRow = document.createElement('div');
    everydayRow.style.display = 'flex';
    everydayRow.style.alignItems = 'center';
    everydayRow.style.gap = '0.5rem';

    everydayRow.appendChild(endDateInput);
    everydayRow.appendChild(addEverydayBtn);

    taskInputWrapper.appendChild(everydayRow);
    card.appendChild(taskInputWrapper);

    const notes = document.createElement('textarea');
    notes.placeholder = 'Notes / To-Do List...';
    notes.id = `notes-current`;
    notes.style.margin = '1rem 0';
    card.appendChild(notes);

    const taskList = document.createElement('ul');
    taskList.style.listStyle = 'none';
    taskList.style.padding = '0';
    taskList.style.margin = '0.5rem 0 1rem 0';

    const dayKey = formatDate(currentDay);
    if (!tasksPerDay[dayKey]) tasksPerDay[dayKey] = [];
    function renderTasks() {
      taskList.innerHTML = '';
      tasksPerDay[dayKey].forEach((task, i) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.flexDirection = 'column';
        li.style.alignItems = 'flex-start';
        li.style.gap = '0.2rem';
        li.style.marginBottom = '0.3rem';

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '0.7rem';
        row.style.width = '100%';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!task.done;
        cb.addEventListener('change', () => {
          task.done = cb.checked;
          saveTasks();
          renderTasks();
        });

        const span = document.createElement('span');
        span.textContent = task.text;
        span.className = task.done ? 'done' : '';

        const rm = document.createElement('button');
        rm.textContent = '✕';
        rm.style.background = 'none';
        rm.style.border = 'none';
        rm.style.color = '#d32f2f';
        rm.style.cursor = 'pointer';
        rm.style.fontSize = '1rem';
        rm.addEventListener('click', () => {
          tasksPerDay[dayKey].splice(i, 1);
          saveTasks();
          renderTasks();
        });

        row.appendChild(cb);
        row.appendChild(span);
        row.appendChild(rm);

        const delAllBtn = document.createElement('button');
        delAllBtn.textContent = 'Delete from all days';
        delAllBtn.style.background = '#fff';
        delAllBtn.style.color = '#d32f2f';
        delAllBtn.style.border = '1px solid #d32f2f';
        delAllBtn.style.borderRadius = '4px';
        delAllBtn.style.fontSize = '0.95rem';
        delAllBtn.style.margin = '0.2rem 0 0.2rem 2.2rem';
        delAllBtn.style.padding = '0.15rem 0.7rem';
        delAllBtn.style.cursor = 'pointer';
        delAllBtn.addEventListener('click', () => {
          Object.keys(tasksPerDay).forEach(key => {
            tasksPerDay[key] = tasksPerDay[key].filter(
              t => !(t.text === task.text && t.desc === task.desc)
            );
          });
          saveTasks();
          renderTasks();
        });

        li.appendChild(row);
        li.appendChild(delAllBtn);

        if (task.desc) {
          const desc = document.createElement('div');
          desc.className = 'task-desc';
          desc.textContent = task.desc;
          li.appendChild(desc);
        }

        taskList.appendChild(li);
      });
    }
    renderTasks();

    addBtn.onclick = () => {
      const title = taskTitleInput.value.trim(), desc = taskDescInput.value.trim();
      if (title) {
        tasksPerDay[dayKey].push({ text: title, desc, done: false });
        taskTitleInput.value = '';
        taskDescInput.value = '';
        saveTasks();
        renderTasks();
      }
    };

    addEverydayBtn.onclick = () => {
      const title = taskTitleInput.value.trim(), desc = taskDescInput.value.trim();
      const endValue = endDateInput.value;

      if (!title) return;
      if (!endValue) {
        alert('Please select the last date.');
        return;
      }

      const start = currentDay;
      const end = new Date(endValue);

      if (start > end) {
        alert('Last date must be after or equal to today.');
        return;
      }

      daysArray.forEach(day => {
        if (day >= start && day <= end) {
          const key = formatDate(day);
          if (!tasksPerDay[key]) tasksPerDay[key] = [];
          tasksPerDay[key].push({ text: title, desc, done: false });
        }
      });

      taskTitleInput.value = '';
      taskDescInput.value = '';
      endDateInput.value = '';
      saveTasks();
      renderTasks();
      alert('Task added to every selected day!');
    };

    taskTitleInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') addBtn.onclick();
    });
    taskDescInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') addBtn.onclick();
    });

    card.appendChild(taskList);

    current.appendChild(card);
  }

  // refresh quote every time layout changes
  showMotivationalQuote();
}

function generateMiniCalendar() {
  const mini = document.getElementById('mini-calendar');
  mini.innerHTML = '';
  const header = document.createElement('div');
  Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' });
  const btn = (txt, func) => {
    const b = document.createElement('button');
    b.textContent = txt; b.style.cursor = 'pointer'; b.onclick = func;
    return b;
  };
  header.append(btn('←', () => { miniCalMonth = miniCalMonth === 0 ? 11 : miniCalMonth - 1; miniCalYear += miniCalMonth === 11 ? -1 : 0; generateMiniCalendar(); }));
  const label = document.createElement('span');
  label.textContent = new Date(miniCalYear, miniCalMonth).toLocaleString('en-GB', { month: 'long', year: 'numeric' });
  label.style.fontWeight = 'bold';
  header.append(label);
  header.append(btn('→', () => { miniCalMonth = miniCalMonth === 11 ? 0 : miniCalMonth + 1; miniCalYear += miniCalMonth === 0 ? 1 : 0; generateMiniCalendar(); }));
  mini.append(header);

  const table = document.createElement('table');
  table.style.width = '100%';
  const thead = document.createElement('thead'), tr = document.createElement('tr');
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    const th = document.createElement('th');
    th.textContent = d;
    Object.assign(th.style, { fontWeight: 'bold', fontSize: '0.95em', padding: '2px' });
    tr.appendChild(th);
  });
  thead.appendChild(tr); table.appendChild(thead);
  const tbody = document.createElement('tbody');
  const first = new Date(miniCalYear, miniCalMonth, 1), last = new Date(miniCalYear, miniCalMonth + 1, 0);
  let week = [];

  for (let i = 0; i < first.getDay(); i++) week.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(miniCalYear, miniCalMonth, d);
    const idx = daysArray.findIndex(day => day.getDate() === d && day.getMonth() === miniCalMonth && day.getFullYear() === miniCalYear);
    week.push({ date, idx });
    if (week.length === 7) {
      const row = document.createElement('tr');
      week.forEach(day => {
        const td = document.createElement('td');
        if (day) {
          td.textContent = day.date.getDate();
          Object.assign(td.style, { textAlign: 'center', cursor: 'pointer', padding: '2px 0' });
          if (selectedDayIdx !== null && day.idx === selectedDayIdx) Object.assign(td.style, { background: '#1976d2', color: '#fff', borderRadius: '50%' });
          td.onclick = () => { generateDaysLayout(day.idx, 0); generateMiniCalendar(); };

          const isToday =
            day &&
            day.date.getDate() === new Date().getDate() &&
            day.date.getMonth() === new Date().getMonth() &&
            day.date.getFullYear() === new Date().getFullYear();

          if (isToday) td.classList.add('today-circle');
        }
        row.appendChild(td);
      });
      tbody.appendChild(row); week = [];
    }
  }

  if (week.length) {
    while (week.length < 7) week.push(null);
    const row = document.createElement('tr');
    week.forEach(day => {
      const td = document.createElement('td');
      if (day) {
        td.textContent = day.date.getDate();
        Object.assign(td.style, { textAlign: 'center', cursor: 'pointer', padding: '2px 0' });
        if (selectedDayIdx !== null && day.idx === selectedDayIdx) Object.assign(td.style, { background: '#1976d2', color: '#fff', borderRadius: '50%' });
        td.onclick = () => { generateDaysLayout(day.idx, 0); generateMiniCalendar(); };

        const isToday =
          day &&
          day.date.getDate() === new Date().getDate() &&
          day.date.getMonth() === new Date().getMonth() &&
          day.date.getFullYear() === new Date().getFullYear();

        if (isToday) td.classList.add('today-circle');
      }
      row.appendChild(td);
    });
    tbody.appendChild(row);
  }
  table.appendChild(tbody); mini.appendChild(table);
}

function showMotivationalQuote() {
  const qDiv = document.getElementById('motivational-quote');
  if (qDiv) {
    qDiv.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }
}

window.onload = function() {
  loadTasks();

  const today = new Date();
  if (today.getFullYear() === 2025) {
    miniCalMonth = today.getMonth();
    miniCalYear = 2025;
  } else {
    miniCalMonth = 0;
    miniCalYear = 2025;
  }
  generateDaysLayout();
  generateMiniCalendar();
  showMotivationalQuote();
};
