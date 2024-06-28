
const express = require('express');
const pool = require('../db'); 
const taskRouter = express.Router();



// Route to get all tasks
taskRouter.get('/tasks', async (req, res) => {
    try {
        const [tasks] = await pool.query('SELECT * FROM taskslist');
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).json({ error: 'Database query failed', message: err.message });
    }
});

// Route to add a task
taskRouter.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const [result] = await pool.query('INSERT INTO taskslist (title, description) VALUES (?, ?)', [title, description]);
        const [task] = await pool.query('SELECT * FROM taskslist WHERE id = ?', [result.insertId]);
        res.status(201).json(task[0]);
    } catch (err) {
        console.error('Error adding task:', err.message);
        res.status(500).json({ error: 'Database query failed', message: err.message });
    }
});

// Route to update a task
taskRouter.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    if (!title && !description && !status) {
        return res.status(400).json({ error: 'At least one field (title, description, status) is required' });
    }
    try {
        const [result] = await pool.query('UPDATE taskslist SET title = ?, description = ?, status = ? WHERE id = ?', [title, description, status, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const [task] = await pool.query('SELECT * FROM taskslist WHERE id = ?', [id]);
        res.json({ message: 'Task updated successfully', task: task[0] });
    } catch (err) {
        console.error('Error updating task:', err.message);
        res.status(500).json({ error: 'Database query failed', message: err.message });
    }
});

// Route to delete a task
taskRouter.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM taskslist WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err.message);
        res.status(500).json({ error: 'Database query failed', message: err.message });
    }
});

module.exports = taskRouter;