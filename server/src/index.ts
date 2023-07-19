import { config } from "@app/config"
import express from "express"

const app = express()
const { host, port } = config.appConfig

const startServer = async () => {
  // Run the server at given host and port
  app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
  })
}

startServer()
