import { PlayerObject } from "@server/features/players/playerObject"
import { convertDateISOStringToTimestamp } from "@server/helpers/dates/convertDateISOStringToTimestamp"
import { ZodError } from "zod"

describe("PlayerObject", () => {
  it("should be able to parse player schema object", () => {
    const timestamp = convertDateISOStringToTimestamp(new Date().toISOString())

    expect(
      PlayerObject.parse({
        created_at: timestamp,
        deleted_at: timestamp,
        last_active_at: timestamp,
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$3Unc21Hx7bxpa2tXVL8vWg$TIvo6k1KfAoba3YT93dxLddBYfj5dJvqJxJM3f1bb1s",
        player_id: "52919232-627a-413e-bcfa-50c5f204c6a7",
        username: "random_user",
      }),
    ).toEqual({
      created_at: timestamp,
      deleted_at: timestamp,
      last_active_at: timestamp,
      password:
        "$argon2id$v=19$m=65536,t=3,p=4$3Unc21Hx7bxpa2tXVL8vWg$TIvo6k1KfAoba3YT93dxLddBYfj5dJvqJxJM3f1bb1s",
      player_id: "52919232-627a-413e-bcfa-50c5f204c6a7",
      username: "random_user",
    })
  })

  it("should throw an error while parsing incorrect fields", () => {
    try {
      PlayerObject.parse({
        created_at: "123",
        deleted_at: "345",
        last_active_at: "789",
        password: 6745,
        player_id: "wrong_id",
        username:
          "random_user_more_than_100_characters_random_user_more_than_100_characters_random_user_more_than_100_characters_random_user_more_than_100_characters_random_user_more_than_100_characters_random_user_more_than_100_characters_random_user_more_than_100_characters_random_user_more_than_100_characters_",
      })
    } catch (error) {
      const zodError = error as ZodError

      expect(Array.isArray(zodError.errors)).toBe(true)
      expect(zodError.errors).toEqual([
        {
          code: "invalid_type",
          expected: "number",
          message: "Expected number, received string",
          path: ["created_at"],
          received: "string",
        },
        {
          code: "invalid_type",
          expected: "number",
          message: "Expected number, received string",
          path: ["deleted_at"],
          received: "string",
        },
        {
          code: "invalid_type",
          expected: "number",
          message: "Expected number, received string",
          path: ["last_active_at"],
          received: "string",
        },
        {
          code: "invalid_type",
          expected: "string",
          message: "Expected string, received number",
          path: ["password"],
          received: "number",
        },
        {
          code: "invalid_string",
          message: "Invalid uuid",
          path: ["player_id"],
          validation: "uuid",
        },
        {
          code: "too_big",
          exact: false,
          inclusive: true,
          maximum: 100,
          message: "String must contain at most 100 character(s)",
          path: ["username"],
          type: "string",
        },
      ])
    }
  })
})
