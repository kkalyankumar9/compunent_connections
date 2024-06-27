const express = require('express');
const database = require('../db');
const taskRouter = express.Router();

// Route to get all tasks
taskRouter.get('/tasks', async (req, res) => {
  try {
    const tasks = await database.query('SELECT * FROM taskslist', { type: database.QueryTypes.SELECT });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).json({ error: 'Database query failed', message: err.message });
  }
});

// Route to add a task
taskRouter.post('/tasks', async (req, res) => {
  const { title, description,status } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await database.query('INSERT INTO taskslist (title, description,status) VALUES (?, ?, ?)', {
      replacements: [title, description,status],
      type: database.QueryTypes.INSERT,
    });
    const taskId = result[0];
    const task = await database.query('SELECT * FROM taskslist WHERE id = ?', {
      replacements: [taskId],
      type: database.QueryTypes.SELECT,
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

  if (!title && !description && !status) {
    return res.status(400).json({ error: 'At least one field (title, description, status) is required' });
  }

  const fieldsToUpdate = [];
  const replacements = [];

  if (title) {
    fieldsToUpdate.push('title = ?');
    replacements.push(title);
  }

  if (description) {
    fieldsToUpdate.push('description = ?');
    replacements.push(description);
  }

  if (status) {
    fieldsToUpdate.push('status = ?');
    replacements.push(status);
  }

  replacements.push(id);

  try {
    const query = `UPDATE taskslist SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    const result = await database.query(query, { replacements, type: database.QueryTypes.UPDATE });

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = await database.query('SELECT * FROM taskslist WHERE id = ?', {
      replacements: [id],
      type: database.QueryTypes.SELECT,
    });

    res.json({ message: 'Task updated successfully', task: task[0] });
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(500).json({ error: 'Database query failed', message: err.message });
  }
});


taskRouter.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const userId = +id; 
  console.log(userId);

  try {
   
    const [result] = await database.query('DELETE FROM taskslist WHERE id = ?', {
      replacements: [userId],
      type: database.QueryTypes.DELETE,
    });

    
    console.log('Delete result:', result);

    
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
  