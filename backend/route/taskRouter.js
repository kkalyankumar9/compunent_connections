const express = require('express');
const db = require('../db');
const taskRouter = express.Router();

// Get all tasks
taskRouter.get('/tasks', async (req, res) => {
    try {
        const [tasks] = await db.query('SELECT * FROM tasks');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Database query failed', message: err.message });
    }
});
// add a task
taskRouter.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const [result] = await db.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description]);
        const [task] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
        res.status(201).json(task[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database query failed', message: err.message });
    }
});

// Update a task
taskRouter.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    if (!title && !description && !status) {
        return res.status(400).json({ error: 'At least one field (title, description, status) is required' });
    }
    try {
        const [result] = await db.query('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [title, description, status, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const [task] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json({ message: 'Task updated successfully', task: task[0] });
    } catch (err) {
        res.status(500).json({ error: 'Database query failed', message: err.message });
    }
});

// Delete a task
taskRouter.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database query failed', message: err.message });
    }
});

module.exports = taskRouter;
