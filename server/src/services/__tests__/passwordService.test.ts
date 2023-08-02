import { PasswordService } from "@server/services/passwordService"

describe("PasswordService", () => {
  it("should be able to hash and validate given password", async () => {
    const password1 = "fake_password_123"
    const password2 = "another_password_456"

    const password1Hash = await PasswordService.hash(password1)

    const correctPassword = await PasswordService.verify(
      password1Hash,
      password1,
    )
    expect(correctPassword).toBe(true)

    const incorrectPassword = await PasswordService.verify(
      password1Hash,
      password2,
    )
    expect(incorrectPassword).toBe(false)
  })
})
