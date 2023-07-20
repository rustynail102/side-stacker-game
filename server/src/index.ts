import {
  createWebsocketsServer,
  websocketsServer,
} from "@app/clients/websocketsServer"
import { config } from "@app/config"
import { initializers } from "@app/initializers"
import { useMiddlewares } from "@app/middlewares"
import { handleHttpErrorsMiddleware } from "@app/middlewares/handleHttpErrors"
import express from "express"
import { createServer } from "http"

const app = express()

const httpServer = createServer(app)
createWebsocketsServer(httpServer)

const startServer = async () => {
  // Initializers
  await Promise.all(initializers.map((initializer) => initializer()))

  // Middlewares
  await useMiddlewares(app, websocketsServer)

  // HTTP Errors middleware
  app.use(handleHttpErrorsMiddleware)

  const { appConfig } = config
  const { host, port } = appConfig.httpServer

  websocketsServer.listen(port)

  // Run the server at given host and port
  httpServer.listen(port, host, () => {
    console.log(`HTTP server running at http://${host}:${port}/`)
    console.log(`WS server running at ws://${host}:${port}/`)
  })
}

startServer()
