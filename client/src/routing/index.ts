import { homeRoute, rootRoute } from "@app/routing/routes"
import { Router } from "@tanstack/router"

export const routeTree = rootRoute.addChildren([homeRoute])

export const router = new Router({ routeTree })
