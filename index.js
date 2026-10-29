document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const errorMessage = document.getElementById('error-message');
    const tasksContainer = document.getElementById('tasks-container');

    const totalCounter = document.getElementById('total-counter');
    const completedCounter = document.getElementById('completed-counter');
    const incompletedCounter = document.getElementById('incompleted-counter');

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    let tasks = [
        { id: 1, text: 'Bienvenido a TODO APP!', completed: false },
        { id: 2, text: 'Esto es una lista de tareas', completed: true },
        { id: 3, text: 'Esta es una tarea con un texto bastante largo para verificar que el texto no se rompa ni se salga de la pantalla', completed: false }
    ];

    taskInput.addEventListener('input', () => {
        if (taskInput.value.trim() !== '') {
            errorMessage.style.display = 'none';
        }
    });

    function renderTasks() {
        tasksContainer.innerHTML = '';

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.completed) {
                taskItem.classList.add('completed');
            }

            taskItem.innerHTML = `
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
                <p class="task-text">${escapeHTML(task.text)}</p>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask(${task.id})">
                        <ion-icon name="create-outline"></ion-icon>
                    </button>
                    <button class="check-btn" onclick="toggleTask(${task.id})">
                        <ion-icon name="checkmark-outline"></ion-icon>
                    </button>
                </div>
            `;

            tasksContainer.appendChild(taskItem);
        });

        updateCounters();
    }

    function addTask() {
        const text = taskInput.value.trim();

        if (text === '') {
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = '';
        renderTasks();
    }

    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    window.toggleTask = function(id) {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        renderTasks();
    };

    window.deleteTask = function(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    };

    window.editTask = function(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        tasksContainer.innerHTML = '';

        tasks.forEach(t => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (t.completed) {
                taskItem.classList.add('completed');
            }

            if (t.id === id) {
                taskItem.innerHTML = `
                    <button class="delete-btn" onclick="deleteTask(${t.id})">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                    <input type="text" class="edit-input" id="input-edit-${t.id}" value="${escapeHTML(t.text)}" style="flex: 1; padding: 5px 10px; border: 1px solid var(--border-color); border-radius: 4px; background-color: var(--bg-color); color: var(--text-color); outline: none;">
                    <div class="task-actions">
                        <button class="save-btn" onclick="saveTask(${t.id})" style="background: transparent; border: none; color: #22c55e; font-size: 1.2rem; cursor: pointer; padding: 5px;">
                            <ion-icon name="checkmark-done-outline"></ion-icon>
                        </button>
                    </div>
                `;
            } else {
                taskItem.innerHTML = `
                    <button class="delete-btn" onclick="deleteTask(${t.id})">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                    <p class="task-text">${escapeHTML(t.text)}</p>
                    <div class="task-actions">
                        <button class="edit-btn" onclick="editTask(${t.id})">
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                        <button class="check-btn" onclick="toggleTask(${t.id})">
                            <ion-icon name="checkmark-outline"></ion-icon>
                        </button>
                    </div>
                `;
            }

            tasksContainer.appendChild(taskItem);
        });

        const editInput = document.getElementById(`input-edit-${id}`);
        if (editInput) {
            editInput.focus();
            editInput.setSelectionRange(editInput.value.length, editInput.value.length);
            
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveTask(id);
                }
            });
        }
    };

    window.saveTask = function(id) {
        const editInput = document.getElementById(`input-edit-${id}`);
        if (!editInput) return;

        const newText = editInput.value.trim();
        if (newText !== '') {
            tasks = tasks.map(task => 
                task.id === id ? { ...task, text: newText } : task
            );
        }
        renderTasks();
    };

    function updateCounters() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const incompleted = total - completed;

        totalCounter.textContent = `Total: ${total}`;
        completedCounter.textContent = `Completadas: ${completed}`;
        incompletedCounter.textContent = `Incompletas: ${incompleted}`;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        themeIcon.setAttribute('name', isLight ? 'sunny-outline' : 'moon-outline');
    });

    renderTasks();
});