'use client'

import { useState, useEffect } from 'react'

interface Task {
  _id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const data = await fetch('/api/tasks', { cache: 'no-store' }).then(r => r.json())
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTask),
      })
      if (res.ok) { setNewTask({ title: '', description: '' }); fetchTasks() }
    } catch (error) { console.error('Error adding task:', error) }
  }

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed }) })
      if (res.ok) fetchTasks()
    } catch (error) { console.error('Error updating task:', error) }
  }

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (res.ok) fetchTasks()
    } catch (error) { console.error('Error deleting task:', error) }
  }

  if (loading) return (<div><h1>Task Manager</h1><p>Loading...</p></div>)

  return (
    <div>
      <h1>Task Manager</h1>
      <form onSubmit={addTask}>
        <h2>Add New Task</h2>
        <input placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
        <textarea placeholder="Task description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
        <button type="submit">Add Task</button>
      </form>
      <div>
        <h2>Your Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id}>
              <div>
                <div>
                  <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
                  {task.description && (<p>{task.description}</p>)}
                  <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
                </div>
                <div>
                  <button onClick={() => toggleTask(task._id, !task.completed)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
