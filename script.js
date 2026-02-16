let tasks = JSON.parse(localStorage.getItem('pro_todo_tasks')) || [];
let timeLeft = 25 * 60;
let timerInterval = null;
let currentFilter = 'all';

// --- Timer Functions ---
function updateTimer() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${m} : ${s < 10 ? '0' : ''}${s}`;
}

document.getElementById('start-btn').onclick = () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) { timeLeft--; updateTimer(); }
        else { clearInterval(timerInterval); alert("Session over!"); }
    }, 1000);
};

document.getElementById('pause-btn').onclick = () => { clearInterval(timerInterval); timerInterval = null; };
document.getElementById('reset-btn').onclick = () => { timeLeft = 25 * 60; updateTimer(); };

// --- Task Functions ---
function addTask() {
    const name = document.getElementById('task-name').value;
    if (!name) return;

    tasks.push({
        id: Date.now(),
        name: name,
        date: document.getElementById('task-date').value || 'No Date',
        priority: document.getElementById('task-priority').value,
        category: document.getElementById('task-category').value,
        important: document.getElementById('task-important').checked,
        completed: false
    });

    document.getElementById('task-name').value = '';
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('pro_todo_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('task-list');
    const query = document.getElementById('searchInput').value.toLowerCase();
    list.innerHTML = '';
    let completedCount = 0;

    tasks.forEach(t => {
        if (t.completed) completedCount++;

        const matchesFilter = (currentFilter === 'all') || 
                              (currentFilter === 'active' && !t.completed) || 
                              (currentFilter === 'completed' && t.completed);
        const matchesSearch = t.name.toLowerCase().includes(query);

        if (matchesFilter && matchesSearch) {
            const li = document.createElement('li');
            li.className = `task-item ${t.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div>
                    <span>${t.important ? '⭐ ' : ''}<strong>${t.name}</strong></span><br>
                    <small>${t.date} | ${t.priority} | ${t.category}</small>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="pill" style="border-color:var(--success-green); color:var(--success-green)" onclick="toggleTask(${t.id})">✓</button>
                    <button class="pill" style="border-color:var(--danger-red); color:var(--danger-red)" onclick="deleteTask(${t.id})">✕</button>
                </div>
            `;
            list.appendChild(li);
        }
    });

    const per = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
    document.getElementById('progress-fill').style.width = per + '%';
    document.getElementById('progress-text').innerText = per + '% Complete';
}

// --- Event Listeners ---
document.getElementById('add-task-btn').onclick = addTask;
document.getElementById('searchInput').onkeyup = renderTasks;
document.getElementById('clear-completed-btn').onclick = () => {
    tasks = tasks.filter(t => !t.completed);
    saveAndRender();
};

document.querySelectorAll('.pill[data-filter]').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    };
});

// Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'f') { e.preventDefault(); document.getElementById('searchInput').focus(); }
    if (e.ctrlKey && e.key === 'n') { e.preventDefault(); document.getElementById('task-name').focus(); }
});

updateTimer();
saveAndRender();