interface GamePlayerRowBasicProps {
  hasNextMove?: boolean
  isCurrentUser?: boolean
  isDisabled?: boolean
  isWinner?: boolean
  onJoin?: () => void
  onLeave?: () => void
  player?: {
    is_online?: boolean
    player_id: string
    username: string
  }
  type: GamePlayerRowType
}

export enum GamePlayerRowType {
  Player1,
  Player2,
}

export type GamePlayerRowProps =
  | (GamePlayerRowBasicProps & {
      onJoin?: () => void
    })
  | (GamePlayerRowBasicProps & {
      onLeave?: () => void
    })
