import mongoose from 'mongoose'

const { Schema } = mongoose;

export type Roles = {
  creator?: true
  reader?: true
  updater?: true
  deleter?: true
}

export type UserType = {
  fName: string
  lName: string
  email: string
  roles: Roles
}

export type AuthRequest = Request & {
  user?: UserType
}

const userSchema = new Schema<UserType>({
  fName: String,
  lName: String,
  email: String,
  roles: {
    creator: Boolean,
    reader: Boolean,
    updater: Boolean,
    deleter: Boolean,
  },
});

export const USER = mongoose.model('user', userSchema)
