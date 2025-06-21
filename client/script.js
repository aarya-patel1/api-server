document.addEventListener('DOMContentLoaded', () => {
    // Update time display
    function updateTime() {
        const now = new Date();
        const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        document.getElementById('current-time').textContent = timeString;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Task form handler
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
            
            // Clear form
            document.getElementById('task-title').value = '';
            document.getElementById('task-description').value = '';
            
            // Refresh task list
            fetchTasks();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add task. Please check console for details.');
        }
    });

    // Fetch and display tasks
    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:3000/api/tasks');
            if (!response.ok) throw new Error('Failed to load tasks');
            
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            document.getElementById('task-list').innerHTML = 
                '<div class="task"><p>Error loading tasks. Check console.</p></div>';
        }
    }

    function renderTasks(tasks) {
        const container = document.getElementById('task-list');
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="task"><p>No tasks yet. Add one above!</p></div>';
            return;
        }
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description || 'No description'}</p>
            `;
            container.appendChild(taskElement);
        });
    }

    // Initial load
    fetchTasks();
});