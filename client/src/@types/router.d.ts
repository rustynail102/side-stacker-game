import { router } from "@app/routing"

declare module "@tanstack/router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router
  }
}
