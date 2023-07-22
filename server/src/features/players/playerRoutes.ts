import { PlayerController } from "@app/features/players/playerController"
import { requestAsyncHandlerMiddleware } from "@app/middlewares/http/requestAsyncHandler"
import { Path } from "@app/routes/paths"
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
  Path.Player,
  requestAsyncHandlerMiddleware(PlayerController.getById),
)
playersRouter.put(
  Path.Player,
  requestAsyncHandlerMiddleware(PlayerController.update),
)

export { playersRouter }
