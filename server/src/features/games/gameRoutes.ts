import { GameController } from "@server/features/games/gameController"
import { requestAsyncHandlerMiddleware } from "@server/middlewares/http/requestAsyncHandler"
import { Path } from "@server/routes/paths"
import express from "express"

const gamesRouter = express.Router()

gamesRouter.post(
  Path.Games,
  requestAsyncHandlerMiddleware(GameController.create),
)
gamesRouter.get(
  Path.Games,
  requestAsyncHandlerMiddleware(GameController.getAll),
)
gamesRouter.get(
  Path.Game,
  requestAsyncHandlerMiddleware(GameController.getById),
)
gamesRouter.put(Path.Game, requestAsyncHandlerMiddleware(GameController.update))

export { gamesRouter }
