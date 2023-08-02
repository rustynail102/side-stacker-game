import { finishedGameMock, openGameMock } from "@client/__mocks__/data"
import { calculateNumberOfPlayersInGame } from "@client/helpers/data/calculateNumberOfPlayersInGame"
import { describe, it, expect } from "vitest"

describe("calculateNumberOfPlayersInGame", () => {
  it("Should return 2 if both players are present", () => {
    expect(calculateNumberOfPlayersInGame(finishedGameMock)).toBe(2)
  })

  it("Should return 1 if there is only 1 player", () => {
    expect(calculateNumberOfPlayersInGame(openGameMock)).toBe(1)
  })

  it("Should return 0 if there are no players", () => {
    expect(
      calculateNumberOfPlayersInGame({
        ...openGameMock,
        player1_id: null,
        player2_id: null,
      }),
    ).toBe(0)
  })
})
