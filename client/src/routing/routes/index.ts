import { RootRoute, Route, lazy } from "@tanstack/router"
import { RootContainer } from "@app/containers/root/RootContainer"
import { Path } from "@app/@enums/paths"

export const rootRoute = new RootRoute({
  component: RootContainer,
})

export const homeRoute = new Route({
  component: lazy(() =>
    import("@app/containers/home/HomeContainer").then((module) => ({
      default: module.HomeContainer,
    })),
  ),
  getParentRoute: () => rootRoute,
  path: Path.Home,
})
