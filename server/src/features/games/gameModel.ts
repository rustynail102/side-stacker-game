import { pool } from "@app/db/pool"
import { OrderDirection } from "@app/features/@types/models"
import { GameModelGetAll } from "@app/features/games/@types/gameModel"
import { Game } from "@app/features/games/@types/gameObject"
import {
  BoardMoveTypeEnum,
  GameObject,
  GameStateEnum,
} from "@app/features/games/gameObject"
import { NotFoundError, createSqlTag } from "slonik"
import { z } from "zod"

const sql = createSqlTag({
  typeAliases: {
    game: GameObject,
    null: z.null(),
  },
})

export class GameModel {
  static create = ({
    player1_id,
    player2_id,
    current_player_id,
    current_game_state,
    next_possible_moves,
    winner_id,
  }: Pick<
    Game,
    | "player1_id"
    | "player2_id"
    | "current_player_id"
    | "current_game_state"
    | "next_possible_moves"
    | "winner_id"
  >): Promise<Game> =>
    pool.connect(async (connection) => {
      const current_board_status_row = new Array(7).fill(
        BoardMoveTypeEnum.enum.empty,
      )
      const current_board_status = new Array(7).fill(current_board_status_row)

      const query = sql.typeAlias("game")`
          INSERT 
          INTO games (game_id, player1_id, player2_id, current_player_id, current_game_state, current_board_status, next_possible_moves, winner_id, created_at) 
          VALUES (uuid_generate_v4(), ${player1_id || ""}, ${
            player2_id || ""
          }, ${current_player_id || ""}, ${
            current_game_state || GameStateEnum.enum.waiting_for_players
          }, ${sql.json(current_board_status)}, ${sql.json(
            next_possible_moves,
          )}, ${winner_id || ""}, NOW())
          RETURNING *
        `

      const { rows } = await connection.query(query)

      return rows[0]
    })

  static getAll = ({
    filters,
    limit = 40,
    offset = 0,
    orderBy = "created_at",
    orderDirection = OrderDirection.DESC,
  }: GameModelGetAll): Promise<readonly Game[]> =>
    pool.connect(async (connection) => {
      const filtersFragments = []

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          filtersFragments.push(
            sql.fragment`${sql.identifier([key])} = ${value}`,
          )
        }
      }

      const direction = orderDirection === OrderDirection.ASC ? "ASC" : "DESC"
      const query = sql.typeAlias("game")`
        SELECT * 
        FROM games 
        WHERE ${sql.join(filtersFragments, sql.unsafe`, `)}
        ORDER BY ${sql.identifier([orderBy])} ${sql.unsafe([direction])} 
        LIMIT ${limit} 
        OFFSET ${offset}
      `

      return connection.many(query)
    })

  static getById = (game_id: Game["game_id"]): Promise<Game> =>
    pool.connect(async (connection) =>
      connection.one(
        sql.typeAlias("game")`
            SELECT * 
            FROM games 
            WHERE game_id = ${game_id}
          `,
      ),
    )

  static update = (
    game_id: Game["game_id"],
    {
      player1_id,
      player2_id,
      current_player_id,
      current_game_state,
      current_board_status,
      next_possible_moves,
      winner_id,
      finished_at,
    }: Partial<
      Pick<
        Game,
        | "player1_id"
        | "player2_id"
        | "current_player_id"
        | "current_game_state"
        | "current_board_status"
        | "next_possible_moves"
        | "winner_id"
        | "finished_at"
      >
    >,
  ): Promise<Game> =>
    pool.connect(async (connection) => {
      const fragments = []

      for (const [key, value] of Object.entries({
        current_game_state,
        current_player_id,
        player1_id,
        player2_id,
        winner_id,
      })) {
        if (value !== undefined) {
          fragments.push(sql.fragment`${sql.identifier([key])} = ${value}`)
        }
      }

      if (finished_at !== undefined) {
        fragments.push(sql.fragment`finished_at = NOW()`)
      }

      if (current_board_status !== undefined) {
        fragments.push(
          sql.fragment`current_board_status = ${sql.json(
            current_board_status,
          )}`,
        )
      }

      if (next_possible_moves !== undefined) {
        fragments.push(
          sql.fragment`next_possible_moves = ${sql.json(next_possible_moves)}`,
        )
      }

      const query = sql.typeAlias("game")`
          UPDATE games
          SET ${sql.join(fragments, sql.unsafe`, `)}
          WHERE game_id = ${game_id}
          RETURNING *
        `

      const { rowCount, rows } = await connection.query(query)

      if (rowCount === 0) {
        throw new NotFoundError(query)
      }

      return rows[0]
    })
}

export const GamesTableInit = sql.unsafe`
    DO $$ BEGIN
        CREATE TYPE game_state AS ENUM ('waiting_for_players', 'in_progress', 'finished');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS games (
        game_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        player1_id UUID REFERENCES players(player_id),
        player2_id UUID REFERENCES players(player_id),
        current_player_id UUID REFERENCES players(player_id),
        current_game_state game_state NOT NULL DEFAULT 'waiting_for_players',
        current_board_status JSONB NOT NULL,
        next_possible_moves JSONB NOT NULL,
        winner_id UUID REFERENCES players(player_id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        finished_at TIMESTAMP
    );
`
