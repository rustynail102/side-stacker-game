import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { GameContainer } from "@client/containers/game/GameContainer"
import {
  GAME_ID,
  PLAYER_1_ID,
  currentUserMock,
  openGameMock,
  player1Mock,
} from "@client/__mocks__/data"
import { TestQueryClientWrapper } from "@client/helpers/tests/TestQueryClientWrapper"

vi.mock("@tanstack/router", () => ({
  useParams: () => ({
    game_id: GAME_ID,
  }),
}))

vi.mock("@client/api/queries/useGetCurrentPlayer", () => ({
  useGetCurrentPlayer: () => ({
    currentPlayer: currentUserMock,
    error: undefined,
    isInitialLoading: false,
  }),
}))

vi.mock("@client/api/queries/useGetGame", () => ({
  useGetGame: () => ({
    error: undefined,
    game: openGameMock,
    isInitialLoading: false,
  }),
}))

vi.mock("@client/api/queries/useGetPlayer", () => ({
  useGetPlayer: ({ player_id }: { player_id: string }) => {
    const player = player_id === PLAYER_1_ID ? player1Mock : undefined

    return {
      error: undefined,
      isInitialLoading: false,
      player,
    }
  },
}))

describe("GameContainer", () => {
  describe("Open Game", () => {
    it("Should render Info section", () => {
      render(<GameContainer />, { wrapper: TestQueryClientWrapper })

      const title = screen.getByTestId("GameInfoCardTitle")
      expect(title).toBeInTheDocument()
      expect(title.textContent).toEqual(openGameMock.name)

      expect(title.parentNode?.childNodes[1].textContent).toEqual(
        "1 spot available",
      )
      expect(title.parentNode?.childNodes[2].textContent).toEqual(
        "12 moves made so far",
      )
    })

    it("Should render Players section", () => {
      render(<GameContainer />, { wrapper: TestQueryClientWrapper })

      const title = screen.getByTestId("GamePlayersSectionTitle")
      expect(title).toBeInTheDocument()
      expect(title.textContent).toEqual("Players")

      const table = screen.getByRole("table")
      const tableHeaderCells = table.querySelectorAll("thead th")

      expect(tableHeaderCells[0].textContent).toEqual(" ")
      expect(tableHeaderCells[1].textContent).toEqual("Name")
      expect(tableHeaderCells[2].textContent).toEqual("Action")

      const tableBodyRows = table.querySelectorAll("tbody tr")

      expect(tableBodyRows.length).toBe(2)

      const tableBodyFirstRowCells = tableBodyRows[0].querySelectorAll("td")

      expect(tableBodyFirstRowCells[0].innerHTML).toEqual(
        // eslint-disable-next-line prettier/prettier
        "<svg class=\"block w-3 h-3 text-primary mx-auto\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" viewBox=\"0 0 701 701\" stroke=\"currentColor\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M.4795 636.796 636.843.4323l63.636 63.6363L64.1158 700.432.4795 636.796Z\"></path><path d=\"M64.1161.4324 700.48 636.796l-63.637 63.636L.4797 64.0687 64.1161.4324Z\"></path></svg>",
      )
      expect(tableBodyFirstRowCells[1].textContent).toEqual(
        player1Mock.username,
      )

      const tableBodySecondRowCells = tableBodyRows[1].querySelectorAll("td")
      expect(tableBodySecondRowCells[0].innerHTML).toEqual(
        // eslint-disable-next-line prettier/prettier
        "<svg class=\"block w-3 h-3 text-secondary mx-auto\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" viewBox=\"0 0 701 701\" stroke=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M350.479 610.341c143.595 0 260-116.406 260-260s-116.405-259.9999-260-259.9999c-143.594 0-259.9995 116.4059-259.9995 259.9999 0 143.594 116.4055 260 259.9995 260Zm0 90c193.3 0 350-156.7 350-350s-156.7-350-350-350C157.18.341.4795 157.041.4795 350.341s156.7005 350 349.9995 350Z\" clip-rule=\"evenodd\"></path></svg>",
      )
      expect(tableBodySecondRowCells[1].textContent).toEqual("Open spot")
      expect(tableBodySecondRowCells[2].textContent).toEqual("Join")
    })

    it("Should render Status section", () => {
      render(<GameContainer />, { wrapper: TestQueryClientWrapper })

      const title = screen.getByTestId("GameStatusCardTitle")
      expect(title).toBeInTheDocument()
      expect(title.textContent).toEqual("Next Move")

      const cardBody =
        title.parentNode?.parentElement?.querySelector(".card-body")
      const cardBodyContent = cardBody?.querySelector("div")

      expect(cardBodyContent?.innerHTML).toEqual(
        // eslint-disable-next-line prettier/prettier
        "<svg class=\"block w-12 h-12 text-primary\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" viewBox=\"0 0 701 701\" stroke=\"currentColor\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M.4795 636.796 636.843.4323l63.636 63.6363L64.1158 700.432.4795 636.796Z\"></path><path d=\"M64.1161.4324 700.48 636.796l-63.637 63.636L.4797 64.0687 64.1161.4324Z\"></path></svg>",
      )
    })

    it("Should render Game Board", () => {
      render(<GameContainer />, { wrapper: TestQueryClientWrapper })

      const gameBoard = screen.getByTestId("GameBoard")
      expect(gameBoard).toBeInTheDocument()
    })
  })
})
