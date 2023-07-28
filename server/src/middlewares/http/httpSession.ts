import { redisStore } from "@server/clients/redis"
import expressSession from "express-session"

export const httpSessionMiddleware = expressSession({
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // A week. Session expiration time (in milliseconds)
    sameSite: false,
    secure: false, // Set to true for HTTPS connections
  },
  name: "session",
  resave: true, // required: force lightweight session keep alive (touch)
  saveUninitialized: false, // recommended: only save session when data exists
  secret: "some_secret", // In real app, this obviously wouldn't be exposed in the source code.
  store: redisStore, // Use Redis to store sessions
})
