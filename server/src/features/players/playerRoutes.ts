import { PlayerController } from "@server/features/players/playerController"
import { requestAsyncHandlerMiddleware } from "@server/middlewares/http/requestAsyncHandler"
import { Path } from "@server/routes/paths"
import express from "express"

const playersRouter = express.Router()

playersRouter.post(
  Path.Players,
  requestAsyncHandlerMiddleware(PlayerController.create),
)
playersRouter.delete(
  Path.Player,
  requestAsyncHandlerMiddleware(PlayerController.delete),
)
playersRouter.get(
  Path.Players,
  requestAsyncHandlerMiddleware(PlayerController.getAll),
)
playersRouter.get(
  Path.CurrentPlayer,
  requestAsyncHandlerMiddleware(PlayerController.getCurrent),
)
playersRouter.get(
  Path.Player,
  requestAsyncHandlerMiddleware(PlayerController.getById),
)
playersRouter.put(
  Path.Player,
  requestAsyncHandlerMiddleware(PlayerController.update),
)

export { playersRouter }
