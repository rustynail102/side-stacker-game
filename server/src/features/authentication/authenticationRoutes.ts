import { AuthenticationController } from "@server/features/authentication/authenticationController"
import { requestAsyncHandlerMiddleware } from "@server/middlewares/http/requestAsyncHandler"
import { Path } from "@server/routes/paths"
import express from "express"

/**
    Authentication router
  */
const authenticationRouter = express.Router()

authenticationRouter.post(
  Path.SignIn,
  requestAsyncHandlerMiddleware(AuthenticationController.signIn),
)
authenticationRouter.post(
  Path.SignOut,
  requestAsyncHandlerMiddleware(AuthenticationController.signOut),
)

export { authenticationRouter }
