export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  disabled?: boolean
  hasError?: boolean
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  value?: string
}
