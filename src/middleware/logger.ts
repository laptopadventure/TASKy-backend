
import { Request, Response, NextFunction } from 'express'


// All middleware has access to the request.
// Here, we're simply logging out the interesting parts
export default function logger(req: Request, res: Response, next: NextFunction) {
  console.log('REQUEST:', req.method, req.path);

  next();
};
