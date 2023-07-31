import { Request, Response, NextFunction } from "express"

/**
 * requestAsyncHandlerMiddleware is an Express middleware that wraps a
 * request handler function to catch and pass any errors to the next middleware.
 */
export const requestAsyncHandlerMiddleware =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
