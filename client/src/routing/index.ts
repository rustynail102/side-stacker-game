import { gameRoute, homeRoute, rootRoute } from "@client/routing/routes"
import { Router } from "@tanstack/router"

const routeTree = rootRoute.addChildren([homeRoute, gameRoute])

export const router = new Router({ routeTree })
