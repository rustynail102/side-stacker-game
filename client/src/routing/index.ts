import {
  gameRoute,
  homeRoute,
  notFoundRoute,
  rootRoute,
} from "@client/routing/routes"
import { Router } from "@tanstack/router"

const routeTree = rootRoute.addChildren([homeRoute, gameRoute, notFoundRoute])

export const router = new Router({ defaultPreload: "intent", routeTree })
