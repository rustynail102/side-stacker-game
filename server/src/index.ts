import { createWebsocketsServer } from "@app/clients/websocketsServer"
import { config } from "@app/config"
import { gamesRouter } from "@app/features/games/gameRoutes"
import { movesRouter } from "@app/features/moves/moveRoutes"
import { playersRouter } from "@app/features/players/playerRoutes"
import { initializers } from "@app/initializers"
import { useHttpMiddlewares } from "@app/middlewares/http"
import { httpErrorsMiddleware } from "@app/middlewares/http/httpErrors"
import { useWsMiddlewares } from "@app/middlewares/ws"
import { Path } from "@app/routes/paths"
import express from "express"
import { createServer as createHttpServer } from "http"

const startServer = async () => {
  const app = express()

  // Create http and ws servers
  const httpServer = createHttpServer(app)
  const websocketsServer = createWebsocketsServer(httpServer)

  // Initializers
  await Promise.all(initializers.map((initializer) => initializer()))

  // Middlewares
  useHttpMiddlewares(app)

  // Routes
  app.use(Path.Root, gamesRouter)
  app.use(Path.Root, movesRouter)
  app.use(Path.Root, playersRouter)

  // HTTP & WS Errors along with WS logging middlewares - have to be used after routing
  app.use(httpErrorsMiddleware)
  useWsMiddlewares(websocketsServer)

  const { appConfig } = config
  const { host, port } = appConfig.httpServer

  // Run ws & http server
  websocketsServer.listen(port)
  httpServer.listen(port, host, () => {
    console.log(`HTTP server running at http://${host}:${port}/`)
    console.log(`WS server running at ws://${host}:${port}/`)
  })
}

startServer()
