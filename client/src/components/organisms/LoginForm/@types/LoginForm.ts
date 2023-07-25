export interface LoginFormValues {
  username: string
}

export interface LoginFormProps {
  isLoading?: boolean
  onSubmit: (values: LoginFormValues) => void
}
