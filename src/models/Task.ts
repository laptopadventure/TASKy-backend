import mongoose from 'mongoose'

const { Schema } = mongoose;

export type TaskType = {
  content: string;
  severity: 1|2|3; //our code is unionized
}

const taskSchema = new Schema<TaskType>({
  content: String,
  severity: Number
});

export const TASK = mongoose.model('task', taskSchema)
