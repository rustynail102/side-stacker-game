import { createWebsocketsServer } from "@server/clients/websocketsServer"
import { config } from "@server/config"
import { gamesRouter } from "@server/features/games/gameRoutes"
import { movesRouter } from "@server/features/moves/moveRoutes"
import { playersRouter } from "@server/features/players/playerRoutes"
import { initializers } from "@server/initializers"
import { useHttpMiddlewares } from "@server/middlewares/http"
import { httpErrorsMiddleware } from "@server/middlewares/http/httpErrors"
import { useWsMiddlewares } from "@server/middlewares/ws"
import { Path } from "@server/routes/paths"
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
