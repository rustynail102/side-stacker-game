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

export const AuthenticationForm: React.FC<AuthenticationFormProps> = ({
  buttonText = "Sign In",
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant={TypographyVariant.Subtitle}>{title}</Typography>

      <TextInput
        autoComplete="on"
        className="mt-6 mb-2"
        disabled={isLoading}
        hasError={Boolean(errors.username)}
        placeholder="Enter your username"
        {...register("username", { required: true })}
      />

      <TextInput
        autoComplete="on"
        className="mb-4"
        disabled={isLoading}
        hasError={Boolean(errors.password)}
        placeholder="Enter your password"
        type="password"
        {...register("password", { required: true })}
      />

      <Button disabled={hasErrors} isLoading={isLoading} type="submit">
        {buttonText}
      </Button>
    </form>
  )
}
