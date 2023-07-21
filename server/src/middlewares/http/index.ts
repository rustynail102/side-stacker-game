import express, { Express } from "express"

export const useHttpMiddlewares = (app: Express) => {
  // Parse application/json
  app.use(express.json())
}
