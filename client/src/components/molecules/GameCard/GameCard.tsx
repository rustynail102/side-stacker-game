import { BadgeType } from "@client/components/atoms/Badge/@types/Badge"
import { Badge } from "@client/components/atoms/Badge/Badge"
import { GamePreview } from "@client/components/molecules/GamePreview/GamePreview"
import { CardType } from "@client/components/molecules/Card/@types/Card"
import { Card } from "@client/components/molecules/Card/Card"
import { GameCardProps } from "@client/components/molecules/GameCard/@types/GameCard"
import { calculateNumberOfPlayersInGame } from "@client/helpers/data/calculateNumberOfPlayersInGame"
import { gameRoute } from "@client/routing/routes"
import { Link } from "@tanstack/router"
import dayjs from "dayjs"
import { mapCurrentBoardStatusToBoard } from "@client/components/molecules/GameCard/helpers/mapCurrentBoardStatusToBoard"
import { getResult } from "@client/components/molecules/GameCard/helpers/getResult"

/**
 * A card component that displays a preview of a game.
 */
export const GameCard: React.FC<GameCardProps> = ({ className = "", game }) => {
  const { game_id, number_of_moves, created_at, name, winning_moves } = game
  const numberOfPlayers = calculateNumberOfPlayersInGame(game)
  const numberOfPlayersBadgeType =
    numberOfPlayers === 2 ? BadgeType.Warning : BadgeType.Success

  const board = mapCurrentBoardStatusToBoard(game)
  const result = getResult(game)

  return (
    <Link className={className} to={gameRoute.to} params={{ game_id }}>
      <Card
        contentTop={
          <figure className="bg-base-300">
            <GamePreview board={board} winningMoves={winning_moves} />
          </figure>
        }
        type={CardType.Link}
        title={name}
      >
        <div className="flex items-center justify-start gap-2 flex-wrap mb-4">
          <Badge type={numberOfPlayersBadgeType}>{numberOfPlayers} / 2</Badge>
          <Badge
            type={
              numberOfPlayers === 2 ? BadgeType.Secondary : BadgeType.Primary
            }
          >
            {number_of_moves} moves
          </Badge>
          {result ? (
            <Badge type={BadgeType.Success}>{result}</Badge>
          ) : (
            <Badge type={BadgeType.Info}>{dayjs(created_at).fromNow()}</Badge>
          )}
        </div>
      </Card>
    </Link>
  )
}
