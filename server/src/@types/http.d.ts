import { Session } from "express-session"

interface CustomSessionData extends SessionData {
  player_id?: Player["player_id"]
}

declare module "http" {
  interface IncomingMessage {
    session: Session & CustomSessionData
  }
}
