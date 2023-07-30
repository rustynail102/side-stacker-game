export const appConfig = {
  cors: {
    credentials: true, // allow credentials (cookies)
    origin: process.env.NODE_ENV === "development" ? true : process.env.ORIGIN, // allow requests from all origins - needed for testing & development
  },
  httpServer: {
    host: "127.0.0.1",
    port: 3000,
  },
}
