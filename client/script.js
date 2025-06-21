document.addEventListener('DOMContentLoaded', () => {
    // Time display
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('current-time').textContent = timeString;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Form submission
    document.getElementById('task-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;

        if (!title) {
            alert('Please enter a title');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });
            
            if (!response.ok) throw new Error('Failed to add task');
            
            document.getElementById('task-form').reset();
            fetchTasks();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add task. Please check console for details.');
        }
    });

    // Fetch tasks
    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:3000/api/tasks');
            if (!response.ok) throw new Error('Failed to load tasks');
            
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            document.getElementById('task-list').innerHTML = 
                '<div class="error-message">Error loading tasks. Check console.</div>';
        }
    }

    // Render tasks
    function renderTasks(tasks) {
        const container = document.getElementById('task-list');
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="no-tasks">No tasks yet. Add one above!</div>';
            return;
        }
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.dataset.id = task.id;
            taskElement.innerHTML = `
                <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <h3>${task.title}</h3>
                    ${task.description ? `<p>${task.description}</p>` : ''}
                </div>
                <button class="delete-btn">Delete</button>
            `;
            container.appendChild(taskElement);
        });

        // Add event listeners
        document.querySelectorAll('.complete-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleComplete);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }

    // Toggle task completion
    async function toggleComplete(e) {
        const taskItem = e.target.closest('.task-item');
        const taskId = taskItem.dataset.id;
        const completed = e.target.checked;
        
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    completed: completed,
                    title: taskItem.querySelector('h3').textContent,
                    description: taskItem.querySelector('p')?.textContent || ''
                })
            });

            if (!response.ok) throw new Error('Failed to update task');
            
            taskItem.classList.toggle('completed', completed);
        } catch (error) {
            console.error('Error:', error);
            e.target.checked = !completed;
            alert('Failed to update task status.');
        }
    }

    // Delete task
    async function deleteTask(e) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        const taskItem = e.target.closest('.task-item');
        const taskId = taskItem.dataset.id;
        
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete task');
            
            taskItem.style.transform = 'translateX(100%)';
            taskItem.style.opacity = '0';
            
            setTimeout(() => {
                taskItem.remove();
                if (!document.querySelector('.task-item')) {
                    document.getElementById('task-list').innerHTML = 
                        '<div class="no-tasks">No tasks remaining. Add a new one!</div>';
                }
            }, 300);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete task.');
        }
    }

    // Initial load
    fetchTasks();
});