import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.route(
    (url) =>
      url.toString().startsWith("http://127.0.0.1:3000/players") &&
      !url.toString().startsWith("http://127.0.0.1:3000/players/current"),
    async (route, request) => {
      const player = {
        created_at: "2023-08-02T15:09:19.175Z",
        deleted_at: null,
        last_active_at: "2023-08-02T15:09:19.175Z",
        player_id: "692c1940-d201-4ce3-9279-b5db44b09bb0",
        username: "Test_User",
      }

      if (request.method() === "POST") {
        await route.fulfill({ json: player })
      } else {
        await route.fulfill({
          json: {
            players: [player],
            total: 1,
          },
        })
      }
    },
  )

  await page.route(
    (url) => url.toString().startsWith("http://127.0.0.1:3000/games"),
    async (route) => {
      await route.fulfill({
        json: {
          games: [],
          total: 1,
        },
      })
    },
  )
})

test.describe("Authentication", () => {
  test("should be able to sign up", async ({ page }) => {
    await page.goto("/")

    // Expect page title
    await expect(page).toHaveTitle("Side-Stacker Game")

    // Sign In form
    const signUpForm = page.getByTestId("SignUpForm")

    await expect(signUpForm).toBeVisible()

    // Inputs
    const usernameInput = signUpForm.getByPlaceholder("Enter your username")
    const passwordInput = signUpForm.getByPlaceholder("Enter your password")

    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()

    // Sign up button
    const signUpButton = signUpForm.getByRole("button")

    await expect(signUpButton).toBeVisible()

    // Fill inputs
    await usernameInput.fill("Test_User")
    await passwordInput.fill("12345678")

    // Click sign up button
    await signUpButton.click()

    // Header
    const header = page.getByTestId("header")
    const menuButton = header.getByTestId("Toggle-dropdown-button")

    // Open dropdown menu in header
    await menuButton.click()

    const greetingText = header.getByTestId("Greeting text")

    await expect(greetingText).toHaveText("Hi, Test_User")
  })

  test("should be able to sign in", async ({ page }) => {
    await page.route("http://127.0.0.1:3000/auth/sign-in", async (route) => {
      const json = {
        created_at: "2023-08-02T15:09:19.175Z",
        deleted_at: null,
        last_active_at: "2023-08-02T15:09:19.175Z",
        player_id: "692c1940-d201-4ce3-9279-b5db44b09bb0",
        username: "Test_User",
      }

      await route.fulfill({ json })
    })

    await page.goto("/")

    // Expect page title
    await expect(page).toHaveTitle("Side-Stacker Game")

    // Sign In form
    const signInForm = page.getByTestId("SignInForm")

    await expect(signInForm).toBeVisible()

    // Inputs
    const usernameInput = signInForm.getByPlaceholder("Enter your username")
    const passwordInput = signInForm.getByPlaceholder("Enter your password")

    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()

    // Sign up button
    const signInButton = signInForm.getByRole("button")

    await expect(signInButton).toBeVisible()

    // Fill inputs
    await usernameInput.fill("Test_User")
    await passwordInput.fill("12345678")

    // Click sign up button
    await signInButton.click()

    // Header
    const header = page.getByTestId("header")
    const menuButton = header.getByTestId("Toggle-dropdown-button")

    // Open dropdown menu in header
    await menuButton.click()

    const greetingText = header.getByTestId("Greeting text")

    await expect(greetingText).toHaveText("Hi, Test_User")
  })
})
