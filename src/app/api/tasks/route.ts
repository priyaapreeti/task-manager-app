import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Task from '../../../../models/Task'

// GET /api/tasks - Fetch all tasks
export async function GET() {
  try {
    await connectDB()
    const tasks = await Task.find().sort({ createdAt: -1 })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    const { title, description } = body
    
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
    })

    await task.save()
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

