import {
  GamesGetAllQueryParams,
  PlayerResponse,
  PlayersGetAllQueryParams,
  QueryKeys,
} from "@server/@types/api"

export const queryKeys = {
  games: {
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
