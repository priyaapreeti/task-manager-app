import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
  title: string
  description: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema)

