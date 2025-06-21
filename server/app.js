const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
const corsOptions = {
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], // Match your frontend port
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// API Routes
app.get('/api/tasks', async (req, res) => {
    try {
        const [tasks] = await db.query('SELECT * FROM tasks');
        res.json(tasks);
    } catch (err) {
        console.error('GET /api/tasks error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        console.log("Received task:", req.body); // Debug logging
        
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        
        const [result] = await db.query(
            'INSERT INTO tasks (title, description) VALUES (?, ?)',
            [title, description || ''] // Handle empty description
        );
        
        console.log("Insert result:", result); // Debug logging
        
        const [task] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
        res.status(201).json(task[0]);
    } catch (err) {
        console.error('POST /api/tasks error:', err);
        res.status(500).json({ 
            error: 'Failed to add task',
            details: err.message 
        });
    }
});

// ... keep your existing PUT and DELETE routes ...

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});