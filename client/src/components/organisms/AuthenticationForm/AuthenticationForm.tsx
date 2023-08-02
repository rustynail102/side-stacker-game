import { Button } from "@client/components/atoms/Button/Button"
import { TextInput } from "@client/components/atoms/TextInput/TextInput"
import {
  AuthenticationFormProps,
  AuthenticationFormValues,
} from "@client/components/organisms/AuthenticationForm/@types/AuthenticationForm"
import { useForm } from "react-hook-form"
import isEmpty from "lodash/isEmpty"
import { Typography } from "@client/components/atoms/Typography/Typography"
import { TypographyVariant } from "@client/components/atoms/Typography/@types/Typography"

/**
 * A form component that handles user authentication. The form includes fields for the user's username and password.
 * It also displays error messages if the form validation fails.
 */
export const AuthenticationForm: React.FC<AuthenticationFormProps> = ({
  buttonText = "Sign In",
  dataTestId,
  isLoading,
  onSubmit,
  title = "Sign In",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthenticationFormValues>()

  const hasErrors = !isEmpty(Object.keys(errors))

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid={dataTestId}>
      <Typography variant={TypographyVariant.Subtitle}>{title}</Typography>

      <TextInput
        aria-label="Username field"
        autoComplete="on"
        className="mt-6 mb-2"
        disabled={isLoading}
        hasError={Boolean(errors.username)}
        placeholder="Enter your username"
        {...register("username", { required: true })}
      />

      <TextInput
        aria-label="Password field"
        autoComplete="on"
        className="mb-4"
        disabled={isLoading}
        hasError={Boolean(errors.password)}
        placeholder="Enter your password"
        type="password"
        {...register("password", { required: true })}
      />

      <Button
        ariaLabel="Submit form"
        disabled={hasErrors}
        isLoading={isLoading}
        type="submit"
      >
        {buttonText}
      </Button>
    </form>
  )
}
