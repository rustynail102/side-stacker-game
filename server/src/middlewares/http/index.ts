import cors from "cors"
import express, { Express } from "express"

export const useHttpMiddlewares = (app: Express) => {
  // Parse application/json
  app.use(express.json())

  // Enable CORS
  app.use(cors({ origin: "http://127.0.0.1:4000" }))
}
