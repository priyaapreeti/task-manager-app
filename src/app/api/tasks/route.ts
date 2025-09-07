import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Task from '../../../../models/Task'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/tasks - Fetch tasks for logged-in user
export async function GET() {
  try {
    const raw = await getServerSession(authOptions as any)
    const session = raw as any
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const tasks = await Task.find({ userId: session.user.id }).sort({ createdAt: -1 })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task for logged-in user
export async function POST(request: NextRequest) {
  try {
    const raw = await getServerSession(authOptions as any)
    const session = raw as any
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      userId: session.user.id,
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

