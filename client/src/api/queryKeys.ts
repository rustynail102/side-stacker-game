import {
  GameResponse,
  GamesGetAllQueryParams,
  PlayerResponse,
  PlayersGetAllQueryParams,
  QueryKeys,
} from "@server/@types/api"

/**
 * Object that keeps the reference to all query keys used to identify
 * entities from the API in the React Query cache.
 *
 * @property {Object} games - Query keys related to the games.
 * @property {Function} games.detail - Function that returns a query key for a specific game detail.
 * @property {Function} games.list - Function that returns a query key for the list of games.
 *
 * @property {Object} players - Query keys related to the players.
 * @property {Array<string>} players.current - Query key for the current player.
 * @property {Function} players.detail - Function that returns a query key for a specific player detail.
 * @property {Function} players.list - Function that returns a query key for the list of players.
 */
export const queryKeys = {
  games: {
    detail: (game_id?: GameResponse["game_id"]) => [
      QueryKeys.Games,
      QueryKeys.Detail,
      game_id,
    ],
    list: (params?: GamesGetAllQueryParams) => [
      QueryKeys.Games,
      QueryKeys.List,
      params,
    ],
  },
  players: {
    current: [QueryKeys.Players, QueryKeys.Current],
    detail: (player_id?: PlayerResponse["player_id"]) => [
      QueryKeys.Players,
      QueryKeys.Detail,
      player_id,
    ],
    list: (params?: PlayersGetAllQueryParams) => [
      QueryKeys.Players,
      QueryKeys.List,
      params,
    ],
  },
}
