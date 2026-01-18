// TaskMaster - Modern Todo App JavaScript

class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateTaskCount();
    }

    bindEvents() {
        // Add task form
        document.getElementById('addTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear completed button
        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.clearCompleted();
        });

        // Task list events (for toggle, edit, delete)
        document.getElementById('taskList').addEventListener('click', (e) => {
            this.handleTaskAction(e);
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();

        if (text === '') return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.render();
        this.updateTaskCount();
        
        input.value = '';
        input.focus();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
            this.updateTaskCount();
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        // If another task is already being edited, cancel it first.
        const currentlyEditing = this.tasks.find(t => t.editing);
        if (currentlyEditing) {
            this.cancelEdit(currentlyEditing.id);
        }

        task.editing = true;
        this.render();
    }

    saveEditedTask(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            if (newText.trim() !== '') {
                task.text = newText.trim();
            }
            delete task.editing;
            this.saveTasks();
            this.render();
        }
    }

    cancelEdit(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            delete task.editing;
            this.render();
        }
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.render();
            this.updateTaskCount();
        }
    }

    handleTaskAction(e) {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = Number(taskItem.dataset.taskId);
        const action = target.dataset.action;

        switch (action) {
            case 'toggle':
                this.toggleTask(taskId);
                break;
            case 'edit':
                this.editTask(taskId);
                break;
            case 'delete':
                this.deleteTask(taskId);
                break;
            case 'save':
                const input = taskItem.querySelector('.edit-input');
                this.saveEditedTask(taskId, input.value);
                break;
            case 'cancel':
                this.cancelEdit(taskId);
                break;
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    clearCompleted() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        if (completedCount === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.render();
            this.updateTaskCount();
        }
    }

    updateTaskCount() {
        const activeCount = this.tasks.filter(task => !task.completed).length;
        document.getElementById('taskCount').textContent = activeCount;
        
        // Update clear button state
        const completedCount = this.tasks.filter(task => task.completed).length;
        const clearBtn = document.getElementById('clearCompleted');
        clearBtn.disabled = completedCount === 0;
    }

    render() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        // Clear current tasks
        taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');
            
            // Update empty state message based on filter
            const emptyTitle = emptyState.querySelector('h3');
            const emptyText = emptyState.querySelector('p');
            
            switch (this.currentFilter) {
                case 'active':
                    emptyTitle.textContent = 'No active tasks';
                    emptyText.textContent = 'All tasks are completed! 🎉';
                    break;
                case 'completed':
                    emptyTitle.textContent = 'No completed tasks';
                    emptyText.textContent = 'Complete some tasks to see them here.';
                    break;
                default:
                    emptyTitle.textContent = 'No tasks yet';
                    emptyText.textContent = 'Add a task above to get started!';
            }
        } else {
            emptyState.classList.add('hidden');
            
            filteredTasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;

        if (task.editing) {
            li.classList.add('editing');
            li.innerHTML = `
                <input type="text" class="edit-input" value="${TodoApp.escapeHtml(task.text)}">
                <div class="task-actions">
                    <button class="task-btn save-btn" data-action="save">
                        Save
                    </button>
                    <button class="task-btn cancel-btn" data-action="cancel">
                        Cancel
                    </button>
                </div>
            `;
            // Automatically focus the input
            setTimeout(() => {
                const input = li.querySelector('.edit-input');
                input.focus();
                input.select();
            }, 0);
        } else {
            li.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle">
                </div>
                <span class="task-text">${TodoApp.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="task-btn edit-btn" data-action="edit">
                        Edit
                    </button>
                    <button class="task-btn delete-btn" data-action="delete">
                        Delete
                    </button>
                </div>
            `;
        }
        return li;
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the app
const app = new TodoApp();

// Add some sample tasks if none exist
if (app.tasks.length === 0) {
    const sampleTasks = [
        { id: 1, text: 'Welcome to TaskMaster! 👋', completed: false, createdAt: new Date().toISOString() },
        { id: 2, text: 'Click the checkbox to mark tasks as complete', completed: false, createdAt: new Date().toISOString() },
        { id: 3, text: 'Use the filter buttons to view different task states', completed: false, createdAt: new Date().toISOString() },
        { id: 4, text: 'This is a completed task example', completed: true, createdAt: new Date().toISOString() }
    ];
    
    app.tasks = sampleTasks;
    app.saveTasks();
    app.render();
    app.updateTaskCount();
}