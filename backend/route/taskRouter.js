const express = require('express');
const database = require('../db');
const { QueryTypes } = require('sequelize');
const taskRouter = express.Router();

// Route to get all tasks
taskRouter.get('/tasks', async (req, res) => {
  try {
    const tasks = await database.query('SELECT * FROM taskslist', { type: QueryTypes.SELECT });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).json({ error: 'Database query failed', message: err.message });
  }
});

// Route to add a task
taskRouter.post('/tasks', async (req, res) => {
  const { title, description, status } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await database.query('INSERT INTO taskslist (title, description, status) VALUES (?, ?, ?)', {
      replacements: [title, description, status],
      type: QueryTypes.INSERT,
    });
    const taskId = result[0];
    const task = await database.query('SELECT * FROM taskslist WHERE id = ?', {
      replacements: [taskId],
      type: QueryTypes.SELECT,
    });
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

  const updates = [];
  if (title) updates.push({ key: 'title', value: title });
  if (description) updates.push({ key: 'description', value: description });
  if (status) updates.push({ key: 'status', value: status });

  if (updates.length === 0) {
    return res.status(400).json({ error: 'At least one field (title, description, status) is required' });
  }

  const updateFields = updates.map(u => `${u.key} = ?`).join(', ');
  const updateValues = updates.map(u => u.value);
  updateValues.push(id);

  try {
    const query = `UPDATE taskslist SET ${updateFields} WHERE id = ?`;
    const result = await database.query(query, {
      replacements: updateValues,
      type: QueryTypes.UPDATE,
    });

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = await database.query('SELECT * FROM taskslist WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.SELECT,
    });

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
    const result = await database.query('DELETE FROM taskslist WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.DELETE,
    });

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).json({ error: 'Database query failed', message: err.message });
  }
});

module.exports = taskRouter;
