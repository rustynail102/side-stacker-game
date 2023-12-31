import { databasePool } from "@server/db/databasePool"
import { FilterType, OrderDirection } from "@server/@types/models"
import {
  GameModelGetAll,
  GameModelUpdateFieldsReturnType,
} from "@server/@types/gameModel"
import {
  MoveTypeEnum,
  GameObject,
  GameStateEnum,
} from "@server/features/games/gameObject"
import {
  DatabasePoolConnection,
  NotFoundError,
  QuerySqlToken,
  SerializableValue,
  ValueExpression,
  createSqlTag,
} from "slonik"
import { ZodTypeAny, z } from "zod"
import { MoveTypeEnum as ApiMoveTypeEnum } from "@server/@types/api"
import { Game } from "@server/@types/gameObject"
import { CountObject } from "@server/db/utils/objects/countObject"

const sql = createSqlTag({
  typeAliases: {
    count: CountObject,
    game: GameObject,
    null: z.null(),
  },
})

/**
 * The GameModel class provides methods for performing database operations on the games table.
 */
export class GameModel {
  /**
   * Helper function for generating an array of SQL fragments for updating fields in the database.
   * @param fields - An object containing the fields to update and their new values.
   * @param keys - An array of keys representing the fields to update.
   * @param types - An object mapping keys to their associated value types.
   * @returns An array of SQL fragments for use in an update query.
   */
  private static updateFields = (
    fields: Partial<Game>,
    keys: (keyof Omit<Game, "created_at" | "game_id" | "name">)[],
    types: Record<keyof Omit<Game, "created_at" | "game_id" | "name">, string>,
  ): GameModelUpdateFieldsReturnType =>
    keys
      .filter((key) => fields[key] !== undefined)
      .map((key) => {
        if (fields[key] === null) {
          return sql.fragment`${sql.identifier([key])} = ${null}`
        } else if (types[key] === "json") {
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

  /**
   * Helper function for executing a database query and handling the NotFoundError.
   * @param connection - The database connection to use for the query.
   * @param query - The SQL query to execute.
   * @returns The first row of the result set from the query.
   * @throws NotFoundError - If no rows were returned by the query.
   */
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

  /**
   * Inserts a new game record into the database.
   * @param game - An object containing the details of the game to create.
   * @returns A Promise that resolves with the created game.
   */
  static create = ({
    player1_id,
    player2_id,
    current_game_state,
    name,
    next_possible_moves,
  }: Pick<
    Game,
    | "player1_id"
    | "player2_id"
    | "current_game_state"
    | "name"
    | "next_possible_moves"
  >): Promise<Game> =>
    databasePool.connect(async (connection) => {
      const current_board_status_row = new Array(7).fill(
        MoveTypeEnum.enum.empty,
      )
      const current_board_status: ApiMoveTypeEnum[][] = new Array(7).fill(
        current_board_status_row,
      )

      const query = sql.typeAlias("game")`
          INSERT 
          INTO games (
            game_id, 
            player1_id, 
            player2_id, 
            current_game_state, 
            current_board_status, 
            name,
            next_possible_moves, 
            number_of_moves, 
            winner_id, 
            winning_moves, 
            created_at
          ) 
          VALUES (
            uuid_generate_v4(), 
            ${player1_id || null}, 
            ${player2_id || null}, 
            ${current_game_state || GameStateEnum.enum.waiting_for_players}, 
            ${sql.json(current_board_status)}, 
            ${name},
            ${sql.json(next_possible_moves)}, 
            ${0}, 
            NULL, 
            NULL, 
            NOW()
          )
          RETURNING *
        `

      const { rows } = await connection.query(query)

      return rows[0]
    })

  /**
   * Retrieves all game records from the database that match the provided filters.
   * @param options - An object containing the filters and pagination options for the query.
   * @returns A Promise that resolves with an object containing the matching games and the total number of games.
   */
  static getAll = ({
    filters,
    limit = 40,
    offset = 0,
    orderBy = "created_at",
    orderDirection = OrderDirection.DESC,
  }: GameModelGetAll): Promise<{
    games: readonly Game[]
    total: number
  }> =>
    databasePool.connect(async (connection) => {
      const filtersFragments = []

      if (filters) {
        for (const filter of filters) {
          const filterFragments = []

          for (const [key, value] of Object.entries(filter.conditions)) {
            if (value !== undefined) {
              filterFragments.push(
                sql.fragment`${sql.identifier([key])} = ${value}`,
              )
            }
          }

          filtersFragments.push(
            sql.fragment`(${sql.join(
              filterFragments,
              filter.filterType === FilterType.AND
                ? sql.unsafe` AND `
                : sql.unsafe` OR `,
            )})`,
          )
        }
      }

      const direction = orderDirection === OrderDirection.ASC ? "ASC" : "DESC"

      let query = sql.typeAlias("game")`
        SELECT * 
        FROM games 
        ORDER BY ${sql.identifier([orderBy])} ${sql.unsafe([direction])} 
        LIMIT ${limit} 
        OFFSET ${offset}
      `

      let countQuery = sql.typeAlias("count")`
        SELECT COUNT(*) 
        FROM games 
      `

      if (filtersFragments.length > 0) {
        query = sql.typeAlias("game")`
          SELECT * 
          FROM games 
          WHERE ${sql.join(filtersFragments, sql.unsafe` OR `)}
          ORDER BY ${sql.identifier([orderBy])} ${sql.unsafe([direction])} 
          LIMIT ${limit} 
          OFFSET ${offset}
        `

        countQuery = sql.typeAlias("count")`
          SELECT COUNT(*) 
          FROM games 
          WHERE ${sql.join(filtersFragments, sql.unsafe` OR `)}
        `
      }

      const { rows } = await connection.query(query)
      const countResult = await connection.query(countQuery)
      const total = parseInt(countResult.rows[0].count, 10)

      return {
        games: rows,
        total,
      }
    })

  /**
   * Retrieves a game record from the database by its ID.
   * @param game_id - The ID of the game to retrieve.
   * @returns A Promise that resolves with the game.
   */
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

  /**
   * Updates a game record in the database.
   * @param game_id - The ID of the game to update.
   * @param fields - An object containing the fields to update and their new values.
   * @returns A Promise that resolves with the updated game.
   */
  static update = (
    game_id: Game["game_id"],
    fields: Partial<Omit<Game, "created_at" | "game_id" | "name">>,
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
          "winning_moves",
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
          winning_moves: "json",
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

/**
 * SQL query to create the games table in the database if it does not already exist.
 */
export const GameModelSchema = sql.unsafe`
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

/**
 * Game Model - current schema. DO NOT USE - it's here only as a reference.
 */
export const GameModelCurrentSchema = sql.unsafe`
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
        name TEXT NOT NULL,
        next_possible_moves JSONB NOT NULL,
        number_of_moves INTEGER NOT NULL DEFAULT 0,
        winner_id UUID REFERENCES players(player_id),
        winning_moves JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        finished_at TIMESTAMP
    );
`
