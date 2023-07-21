import { Request, Response, NextFunction } from "express"

export const requestAsyncHandlerMiddleware =
  async (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
