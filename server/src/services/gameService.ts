import { websocketsServer } from "@app/clients/websocketsServer"
import { GameModel } from "@app/features/games/gameModel"
import { GameStateEnum } from "@app/features/games/gameObject"
import { Player } from "@app/features/players/@types/playerObject"

export class GameService {
  static removeDeletedPlayerFromGames = async (deletedPlayer: Player) => {
    const gamesWithDeletedPlayer = await GameModel.getAll({
      filterType: "OR",
      filters: {
        current_game_state: GameStateEnum.enum.in_progress,
        current_player_id: deletedPlayer.player_id,
        player1_id: deletedPlayer.player_id,
        player2_id: deletedPlayer.player_id,
      },
    })

    if (gamesWithDeletedPlayer.length > 0) {
      await Promise.all(
        gamesWithDeletedPlayer.map((game) => {
          const field = Object.entries(game).find(
            ([, value]) => value === deletedPlayer.player_id,
          )?.[0]

          if (field) {
            return GameModel.update(game.game_id, {
              [field]: "",
            })
          }

          return game
        }),
      )

      // Emit an event to all connected clients to invalidate the games query
      websocketsServer.emit("invalidateQuery", {
        entity: ["games", "list"],
      })
    }
  }
}
