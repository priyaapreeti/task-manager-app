import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Task from '../../../../../models/Task'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const raw = await getServerSession(authOptions as any)
    const session = raw as any
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const { id } = params

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...body, updatedAt: new Date() },
      { new: true }
    )

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const raw = await getServerSession(authOptions as any)
    const session = raw as any
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { id } = params

    const task = await Task.findOneAndDelete({ _id: id, userId: session.user.id })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}

