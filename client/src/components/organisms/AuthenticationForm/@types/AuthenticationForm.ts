export interface AuthenticationFormValues {
  password: string
  username: string
}

export interface AuthenticationFormProps {
  buttonText?: string
  isLoading?: boolean
  onSubmit: (values: AuthenticationFormValues) => void
  title?: string
}
