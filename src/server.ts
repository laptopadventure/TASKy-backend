
// 3rd Party Dependencies (modules)

import Route, { UserClass } from './routes/route_class'
import express from 'express'
import cors from 'cors'
import { verifyUser as v } from './auth/auth'
const verifyUser = v as any;
import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

//MongoDB
mongoose.connect(process.env.DATABASE_URL);
export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('on', () => {
  console.log('Mongoose is connected');
});

export const app = express();
// (and the start function for it)
export function start(port: number) {
  if (!port) {
    throw new Error('Missing Port');
  }
  app.listen(port, () => console.log(`Listening on ${port}`));
}

// error handlers

// const notFoundHandler = require('./error-handlers/404.js');
// const errorHandler = require('./error-handlers/500.js');


import logger from './middleware/logger'

// routes

import { USER } from './models/User'
import { TASK, TaskType } from './models/Task'

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(logger);
//anything above is unauthorized
app.use(verifyUser);
//anything below is authorized

const taskClass = new Route<TaskType, TaskType>(TASK)
//C
app.post(`/task`, taskClass.create.bind(this))
//R (all)
app.get(`/task`, taskClass.readAll.bind(this))
//R (one)
app.get(`/task:id`, taskClass.readOne.bind(this))
//U
app.put(`/task:id`, taskClass.update.bind(this))
//D
app.delete(`/task:id`, taskClass.delete.bind(this))

const userClass = new UserClass(USER)
app.post('/signup', userClass.signup.bind(userClass))
//C
app.post(`/user`, userClass.create.bind(this))
//R (all)
app.get(`/user`, userClass.readAll.bind(this))
//R (one)
app.get(`/user:id`, userClass.readOne.bind(this))
//U
app.put(`/user:id`, userClass.update.bind(this))
//D
app.delete(`/user:id`, userClass.delete.bind(this))

