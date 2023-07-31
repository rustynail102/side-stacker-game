import { config } from "@server/config"
import { httpSessionMiddleware } from "@server/middlewares/http/httpSession"
import cors from "cors"
import express, { Express } from "express"

/**
 * useHttpMiddlewares sets up the necessary middlewares for the Express application.
 */
export const useHttpMiddlewares = (app: Express) => {
  // Initialize session storage
  app.use(httpSessionMiddleware)

  // Parse application/json
  app.use(express.json())

  // Enable CORS for all origins - needed for testing & development
  app.use(cors(config.appConfig.cors))
}
