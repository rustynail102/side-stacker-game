import { config } from "@app/config"
import { initializers } from "@app/initializers"
import { useMiddlewares } from "@app/middlewares"
import { handleErrorsMiddleware } from "@app/middlewares/handleErrors"
import express from "express"

const app = express()
const { host, port } = config.appConfig

const startServer = async () => {
  // Initializers
  await Promise.all(initializers.map((initializer) => initializer()))

  // Middlewares
  await useMiddlewares(app)

  // Errors middleware
  app.use(handleErrorsMiddleware)

  // Run the server at given host and port
  app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
  })
}

startServer()
