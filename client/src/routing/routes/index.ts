import { RootRoute, Route, lazy } from "@tanstack/router"
import { RootContainer } from "@client/containers/root/RootContainer"
import { Path } from "@client/@enums/paths"
import { queryClient } from "@client/clients/queryClient"
import { queryKeys } from "@client/api/queryKeys"
import { Path as ApiPath } from "@server/routes/paths"
import { axiosGet } from "@client/helpers/api/axiosGet"
import { GameResponse } from "@server/@types/api"

/**
 * Defines the root route.
 */
export const rootRoute = new RootRoute({
  component: RootContainer,
})

/**
 * Defines the home route.
 */
export const homeRoute = new Route({
  component: lazy(
    () => import("@client/containers/home/HomeContainer"),
    "HomeContainer",
  ),
  getParentRoute: () => rootRoute,
  path: Path.Home,
})

/**
 * Defines the game route with a loader for prefetching game data.
 * Prefetching happens each time when there's a hover on <Link /> component.
 */
export const gameRoute = new Route({
  component: lazy(
    () => import("@client/containers/game/GameContainer"),
    "GameContainer",
  ),
  getParentRoute: () => rootRoute,
  loader: async ({ preload, params: { game_id } }) => {
    if (preload) {
      await queryClient.prefetchQuery({
        queryFn: () =>
          axiosGet<GameResponse>(
            ApiPath.Game.replace(":game_id", game_id || ""),
          ),
        queryKey: queryKeys.games.detail(game_id),
      })
    }
  },
  path: Path.Game,
})

/**
 * Defines the not found route.
 */
export const notFoundRoute = new Route({
  component: lazy(
    () => import("@client/containers/notFound/NotFoundContainer"),
    "NotFoundContainer",
  ),
  getParentRoute: () => rootRoute,
  path: Path.NotFound,
})
