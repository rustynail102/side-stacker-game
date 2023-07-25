import { TextInputProps } from "@client/components/atoms/TextInput/@types/TextInput"

export const getInputColor = ({
  disabled,
  hasError,
}: Pick<TextInputProps, "hasError" | "disabled">) => {
  if (disabled) {
    return ""
  }

  return hasError ? "input-error" : "input-primary"
}
