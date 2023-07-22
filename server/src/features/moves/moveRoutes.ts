import { MoveController } from "@app/features/moves/moveController"
import { requestAsyncHandlerMiddleware } from "@app/middlewares/http/requestAsyncHandler"
import { Path } from "@app/routes/paths"
import express from "express"

const movesRouter = express.Router()

movesRouter.post(
  Path.Moves,
  requestAsyncHandlerMiddleware(MoveController.create),
)

export { movesRouter }
