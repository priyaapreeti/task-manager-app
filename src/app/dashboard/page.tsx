'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

interface Task {
  _id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTasks()
    } else if (status === 'unauthenticated') {
      setTasks([])
      setLoading(false)
    }
  }, [status])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
      if (res.ok) {
        setNewTask({ title: '', description: '' })
        fetchTasks()
      } else if (res.status === 401) {
        signIn()
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      if (res.ok) fetchTasks()
      else if (res.status === 401) signIn()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (res.ok) fetchTasks()
      else if (res.status === 401) signIn()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  if (status === 'loading' || loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
        <p>Loading...</p>
        {/* <pre className="text-xs mt-4 p-2 bg-gray-100 rounded">
          {JSON.stringify({ status, session: session?.user }, null, 2)}
        </pre> */}
      </div>
    )

  if (status === 'unauthenticated')
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
        <p className="mb-6">Please log in to view and manage your tasks.</p>
        <div className="space-x-3">
          {/* <button onClick={() => signIn()} className="bg-black text-white px-4 py-2 rounded">Login</button> */}
          <button className="bg-black text-white px-4 py-2 rounded-md mr-2">
          <Link href="/login">Login</Link>
        </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Task Manager</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">{session?.user?.name || session?.user?.email}</span>
            <button onClick={() => signOut()} className="bg-gray-200 px-3 py-1 rounded">Logout</button>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="bg-white p-6 rounded shadow space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Add New Task</h2>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">Your Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet. Add one above!</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex justify-between items-start p-4 border border-gray-200 rounded hover:shadow"
                >
                  <div>
                    <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && <p className="text-gray-600">{task.description}</p>}
                    <small className="text-gray-500">Created: {new Date(task.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => toggleTask(task._id, !task.completed)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                    >
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
