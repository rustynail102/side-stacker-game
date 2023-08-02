declare module "supertest-session" {
  import * as supertest from "supertest"
  import * as express from "express"

  function session(
    app: express.Express,
    options?: session.SessionOptions,
  ): session.SuperTestSession

  namespace session {
    interface SessionOptions {
      app?: express.Express
      before?: (req: express.Request) => void
    }

    interface SuperTestSession extends supertest.SuperTest<supertest.Test> {
      set: (field: string, val: string) => SuperTestSession
    }
  }

  export = session
}
