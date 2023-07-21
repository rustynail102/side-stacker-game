import { databasePool } from "@app/db/databasePool"
import { OrderDirection } from "@app/@types/models"
import {
  GameModelGetAll,
  GameModelUpdateFieldsReturnType,
} from "@app/@types/gameModel"
import { Game } from "@app/@types/gameObject"
import {
  BoardMoveTypeEnum,
  GameObject,
  GameStateEnum,
} from "@app/features/games/gameObject"
import {
  DatabasePoolConnection,
  NotFoundError,
  QuerySqlToken,
  SerializableValue,
  ValueExpression,
  createSqlTag,
} from "slonik"
import { ZodTypeAny, z } from "zod"

const sql = createSqlTag({
  typeAliases: {
    game: GameObject,
    null: z.null(),
  },
})

export class GameModel {
  private static updateFields = (
    fields: Partial<Game>,
    keys: (keyof Omit<Game, "created_at" | "game_id">)[],
    types: Record<keyof Omit<Game, "created_at" | "game_id">, string>,
  ): GameModelUpdateFieldsReturnType =>
    keys
      .filter((key) => fields[key] !== undefined)
      .map((key) => {
        if (types[key] === "json") {
          return sql.fragment`${sql.identifier([key])} = ${sql.json(
            fields[key] as SerializableValue,
          )}`
        } else if (types[key] === "now") {
          return sql.fragment`${sql.identifier([key])} = NOW()`
        } else {
          return sql.fragment`${sql.identifier([key])} = ${
            fields[key] as ValueExpression
          }`
        }
      })

  private static async executeQuery(
    connection: DatabasePoolConnection,
    query: QuerySqlToken<ZodTypeAny>,
  ) {
    const { rowCount, rows } = await connection.query(query)

    if (rowCount === 0) {
      throw new NotFoundError(query)
    }

    return rows[0]
  }

  static create = ({
    player1_id,
    player2_id,
    current_game_state,
    next_possible_moves,
    winner_id,
  }: Pick<
    Game,
    | "player1_id"
    | "player2_id"
    | "current_game_state"
    | "next_possible_moves"
    | "winner_id"
  >): Promise<Game> =>
    databasePool.connect(async (connection) => {
      const current_board_status_row = new Array(7).fill(
        BoardMoveTypeEnum.enum.empty,
      )
      const current_board_status = new Array(7).fill(current_board_status_row)

      const query = sql.typeAlias("game")`
          INSERT 
          INTO games (game_id, player1_id, player2_id, current_game_state, current_board_status, next_possible_moves, number_of_moves, winner_id, created_at) 
          VALUES (uuid_generate_v4(), ${player1_id || ""}, ${
            player2_id || ""
          }, ${
            current_game_state || GameStateEnum.enum.waiting_for_players
          }, ${sql.json(current_board_status)}, ${next_possible_moves}, ${0}, ${
            winner_id || ""
          }, NOW())
          RETURNING *
        `

      const { rows } = await connection.query(query)

      return rows[0]
    })

  static getAll = ({
    filters,
    filterType = "AND",
    limit = 40,
    offset = 0,
    orderBy = "created_at",
    orderDirection = OrderDirection.DESC,
  }: GameModelGetAll): Promise<readonly Game[]> =>
    databasePool.connect(async (connection) => {
      const filtersFragments = []

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (Array.isArray(value)) {
            value.forEach((val) => {
              filtersFragments.push(
                sql.fragment`${sql.identifier([key])} = ${val}`,
              )
            })
          } else {
            filtersFragments.push(
              sql.fragment`${sql.identifier([key])} = ${value}`,
            )
          }
        }
      }

      const direction = orderDirection === OrderDirection.ASC ? "ASC" : "DESC"

      const query = sql.typeAlias("game")`
        SELECT * 
        FROM games 
        WHERE ${sql.join(
          filtersFragments,
          filterType === "AND" ? sql.unsafe`, ` : sql.unsafe` OR `,
        )}
        ORDER BY ${sql.identifier([orderBy])} ${sql.unsafe([direction])} 
        LIMIT ${limit} 
        OFFSET ${offset}
      `

      return connection.many(query)
    })

  static getById = (game_id: Game["game_id"]): Promise<Game> =>
    databasePool.connect(async (connection) =>
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
    fields: Partial<Omit<Game, "created_at" | "game_id">>,
  ): Promise<Game> =>
    databasePool.connect(async (connection) => {
      const fragments = GameModel.updateFields(
        fields,
        [
          "current_board_status",
          "current_game_state",
          "finished_at",
          "next_possible_moves",
          "number_of_moves",
          "player1_id",
          "player2_id",
          "winner_id",
        ],
        {
          current_board_status: "json",
          current_game_state: "default",
          finished_at: "now",
          next_possible_moves: "json",
          number_of_moves: "default",
          player1_id: "default",
          player2_id: "default",
          winner_id: "default",
        },
      )

      const query = sql.typeAlias("game")`
          UPDATE games
          SET ${sql.join(fragments, sql.unsafe`, `)}
          WHERE game_id = ${game_id}
          RETURNING *
        `

      return GameModel.executeQuery(connection, query)
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
        current_game_state game_state NOT NULL DEFAULT 'waiting_for_players',
        current_board_status JSONB NOT NULL,
        next_possible_moves JSONB NOT NULL,
        number_of_moves INTEGER NOT NULL DEFAULT 0,
        winner_id UUID REFERENCES players(player_id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        finished_at TIMESTAMP
    );
`
