import {
  gameRoute,
  homeRoute,
  notFoundRoute,
  rootRoute,
} from "@client/routing/routes"
import { Router } from "@tanstack/router"

/**
 * Constructs the route tree and sets up the Router.
 */
const routeTree = rootRoute.addChildren([homeRoute, gameRoute, notFoundRoute])

export const router = new Router({ defaultPreload: "intent", routeTree })
