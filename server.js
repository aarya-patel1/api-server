const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Setup Sequelize connection
const sequelize = new Sequelize('task_manager', 'root', '11july2011', {
  host: 'localhost',
  dialect: 'mysql',
});


// Define Task model
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
});

// Sync models with database
sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch(console.error);

app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// GET /tasks - get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks - create a task
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const newTask = await Task.create({ title, description, status });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id - update task by ID
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id - delete task by ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
