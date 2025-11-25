let tasks = [];

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render all tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        updateTaskCount();
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span class="task-text" onclick="toggleComplete(${index})">${task.text}</span>
            <button class="btn edit-btn" onclick="editTask(${index})">Edit</button>
            <button class="btn delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        
        taskList.appendChild(li);
    });

    updateTaskCount();
}

// Add new task
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    input.value = '';
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

// Edit task
function editTask(index) {
    const newText = prompt('Edit task:', tasks[index].text);
    
    if (newText !== null && newText.trim() !== '') {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Update task count
function updateTaskCount() {
    const countDiv = document.getElementById('taskCount');
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;

    if (total > 0) {
        countDiv.textContent = `${completed} of ${total} tasks completed (${remaining} remaining)`;
    } else {
        countDiv.textContent = '';
    }
}

// Event listeners
document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Load tasks on page load
loadTasks();