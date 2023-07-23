import { PlayerResponse } from "@server/@types/api"

export const queryKeys = {
  players: {
    detail: (player_id?: PlayerResponse["player_id"]) => [
      "players",
      "detail",
      player_id,
    ],
    list: ["players", "list"],
  },
}
