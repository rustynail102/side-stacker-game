import { AuthenticationTemplate } from "@client/components/templates/AuthenticationTemplate/AuthenticationTemplate"
import { AuthenticationContainerSignInSection } from "@client/containers/authentication/sections/signIn/AuthenticationContainerSignInSection"
import { AuthenticationContainerSignUpSection } from "@client/containers/authentication/sections/signUp/AuthenticationContainerSignUpSection"

/**
 * Container component for the authentication page. It includes sections for sign in and sign up forms.
 */
export const AuthenticationContainer: React.FC = () => (
  <AuthenticationTemplate>
    <AuthenticationContainerSignInSection />
    <AuthenticationContainerSignUpSection />
  </AuthenticationTemplate>
)
