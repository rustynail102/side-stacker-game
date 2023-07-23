import { Button } from "@app/components/atoms/Button/Button"
import { Hero } from "@app/components/atoms/Hero/Hero"
import { TextInput } from "@app/components/atoms/TextInput/TextInput"
import {
  LoginFormProps,
  LoginFormValues,
} from "@app/components/molecules/LoginForm/@types/LoginForm"
import { Logo } from "@app/components/molecules/Logo/Logo"
import { useForm } from "react-hook-form"
import isEmpty from "lodash/isEmpty"

export const LoginForm: React.FC<LoginFormProps> = ({
  isLoading,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>()

  const hasErrors = !isEmpty(Object.keys(errors))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Hero>
        <Logo />

        <TextInput
          className="max-w-xs my-10"
          disabled={isLoading}
          hasError={Boolean(errors.username)}
          placeholder="Enter your username"
          {...register("username", { required: true })}
        />

        <Button disabled={hasErrors} isLoading={isLoading} type="submit">
          Get Started
        </Button>
      </Hero>
    </form>
  )
}
