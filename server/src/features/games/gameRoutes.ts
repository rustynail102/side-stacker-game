import { GameController } from "@app/features/games/gameController"
import { requestAsyncHandlerMiddleware } from "@app/middlewares/http/requestAsyncHandler"
import { Path } from "@app/routes/paths"
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
