import { MoveController } from "@server/features/moves/moveController"
import { requestAsyncHandlerMiddleware } from "@server/middlewares/http/requestAsyncHandler"
import { Path } from "@server/routes/paths"
import express from "express"

const movesRouter = express.Router()

movesRouter.post(
  Path.Moves,
  requestAsyncHandlerMiddleware(MoveController.create),
)

export { movesRouter }
