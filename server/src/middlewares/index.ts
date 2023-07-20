import express, { Express } from "express"

export const useMiddlewares = async (app: Express) => {
  // Parse application/json
  app.use(express.json())
}
