import { Response, Express } from 'express'
import { Model } from 'mongoose'
import { AuthRequest, UserType, Roles, USER } from '../models/User'
import jwt from 'jsonwebtoken'

export default class Route<M, ModelObj> {
  model: Model<M>
  constructor(model: Model<M>) {
    this.model = model
  }

  async create(req: AuthRequest & {body: ModelObj & {id?: number}}, res: Response) {
    if(!this.handleAuth(req, res, "creator")) {
      return
    }
    try {
      const found = await this.model.findOne(req.body)
      if(!found) {
        //make a new one
        const created = await this.model.create(req.body)
        res.status(200).send(created)
      } else {
        res.status(200).send(found)
      }
    } catch (e) {
      this.handleCatch(e, res)
    }
  }

  async readAll(req: AuthRequest & {body: ModelObj & {id?: number}}, res: Response) {
    if(!this.handleAuth(req, res, "reader")) {
      return
    }
    try {
      const foundAll = await this.model.find(req.body);
      if(foundAll) {
        res.status(200).send(foundAll);
      }
    } catch (e) {
      this.handleCatch(e, res)
    }
  }

  async readOne(req: AuthRequest & {body: ModelObj & {id?: number}}, res: Response) {
    if(!this.handleAuth(req, res, "reader")) {
      return
    }
    try {
      const found = await this.model.find(req.body)
      if(found) {
        res.status(200).send(found)
      }
    } catch (e) {
      this.handleCatch(e, res)
    }
  }

  async update(req: AuthRequest & {body: ModelObj & {id?: number}}, res: Response) {
    if(!this.handleAuth(req, res, "updater")) {
      return
    }
    try {
      const anybody = req.body as any
      const found = await this.model.find(anybody.id)
      if(!found) {
        res.status(404).send({})
        return
      }
      const updated = await this.model.updateOne(req.body)
      res.status(200).send(updated);
    } catch (e) {
      this.handleCatch(e, res)
    }
  }

  async delete(req: AuthRequest & {body: ModelObj & {id?: number}}, res: Response) {
    if(!this.handleAuth(req, res, "deleter")) {
      return
    }
    try {
      const anybody = req.body as any
      const found = await this.model.find(anybody.id)
      if(!found) {
        res.status(404).send({})
        return
      }
      await this.model.deleteOne(req.body)
      res.status(200).send("Deleted.");
    } catch (e) {
      this.handleCatch(e, res)
    }
  }

  handleAuth(req: AuthRequest & {body: ModelObj & {id?: number}}, res: Response, role: "creator"|"reader"|"updater"|"deleter") {
    if(!(req.user?.roles[role])) {
      res.status(403).send("Not Authorized")
      return false;
    }
    return true;
  }

  handleCatch(error: Error, res: Response) {
    res.status(500).send("Something went wrong on our end.")
    console.warn(error.message)
  }
}

type Signup = {
  fName: string
  lName: string
  email: string
}

type SignupRequest = Request & {
  body: Signup
}

export class UserClass extends Route<UserType, Signup> {
  //user creation without auth checks
  async signup(req: SignupRequest, res: Response) {
    const { fName, lName, email }: Signup = req.body
    if(!fName || !lName || !email) {
      res.status(400).send("signup is missing fName, lName, or email sent in body")
      return
    }
    let user;
    try {
      user = await USER.findOne(req.body)
      if(!user) {
        //make a new one
        const newRoles: Roles = {
          reader: true,
        }
        //first user in the db is an admin
        // await USER.count({}, (error, count) => {
        //   if(count === 0) {
        //     newRoles.creator = true;
        //     newRoles.updater = true;
        //     newRoles.deleter = true;
        //   }
        // })
        const newUser: UserType = {
          fName: fName,
          lName: lName,
          email: email,
          roles: newRoles
        }
        user = await USER.create(newUser)
      }
      const token = jwt.sign({...user}, process.env.SECRET)
      res.status(200).json({token: token})
    } catch (e) {
      this.handleCatch(e, res)
    }
  }
}
