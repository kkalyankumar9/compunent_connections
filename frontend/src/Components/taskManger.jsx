// src/components/TaskManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: '' });
  const [editTask, setEditTask] = useState(null); // State to track which task is being edited

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:8080/api/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

  const addTask = () => {
    if (!newTask.title || !newTask.status) return;
    axios.post('http://localhost:8080/api/tasks', newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', status: '' });
      })
      .catch(error => {
        console.error('Error adding task:', error);
      });
  };

  const updateTask = (id, updatedTask) => {
    axios.patch(`http://localhost:8080/api/tasks/${id}`, updatedTask)
      .then(() => {
        setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
        setEditTask(null); // Clear edit mode after update
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:8080/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  const startEdit = (task) => {
    setEditTask(task);
    setNewTask({ title: task.title, description: task.description, status: task.status });
  };

  const cancelEdit = () => {
    setEditTask(null);
    setNewTask({ title: '', description: '', status: '' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <div className="mb-4 flex flex-wrap items-center">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border p-2 mb-2 md:mr-2 md:mb-0 flex-grow"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="border p-2 mb-2 md:mr-2 md:mb-0 flex-grow"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="border p-2 mb-2 md:mr-2 md:mb-0">
          <option value="">Select status</option>
          <option value="Yet to Start">Yet to Start</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        {editTask ? (
          <>
            <button onClick={() => updateTask(editTask.id, newTask)} className="bg-blue-500 text-white p-2 mb-2 md:mr-2 md:mb-0">Update</button>
            <button onClick={cancelEdit} className="bg-gray-400 text-white p-2">Cancel</button>
          </>
        ) : (
          <button onClick={addTask} className="bg-blue-500 text-white p-2 mb-2 md:mr-2 md:mb-0">Add Task</button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {tasks.map(task => (
              <tr key={task.id} className="border-b border-gray-200">
                <td className="px-4 py-2">
                  {editTask && editTask.id === task.id ? (
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    task.title
                  )}
                </td>
                <td className="px-4 py-2">
                  {editTask && editTask.id === task.id ? (
                    <input
                      type="text"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    task.description
                  )}
                </td>
                <td className="px-4 py-2">
                  {editTask && editTask.id === task.id ? (
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      className="w-full">
                      <option value="">Select status</option>
                      <option value="Yet to Start">Yet to Start</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                    </select>
                  ) : (
                    task.status
                  )}
                </td>
                <td className="px-4 py-2">
                  {editTask && editTask.id === task.id ? (
                    <>
                      <button onClick={() => updateTask(task.id, newTask)} className="bg-blue-500 text-white p-2 mr-2">Save</button>
                      <button onClick={cancelEdit} className="bg-gray-400 text-white p-2">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(task)} className="bg-yellow-500 text-white p-2 mr-2">Edit</button>
                  )}
                  <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white p-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager;
