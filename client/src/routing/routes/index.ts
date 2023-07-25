import { RootRoute, Route, lazy } from "@tanstack/router"
import { RootContainer } from "@client/containers/root/RootContainer"
import { Path } from "@client/@enums/paths"

export const rootRoute = new RootRoute({
  component: RootContainer,
})

export const homeRoute = new Route({
  component: lazy(() =>
    import("@client/containers/home/HomeContainer").then((module) => ({
      default: module.HomeContainer,
    })),
  ),
  getParentRoute: () => rootRoute,
  path: Path.Home,
})

export const gameRoute = new Route({
  component: lazy(() =>
    import("@client/containers/game/GameContainer").then((module) => ({
      default: module.GameContainer,
    })),
  ),
  getParentRoute: () => rootRoute,
  path: Path.Game,
})
