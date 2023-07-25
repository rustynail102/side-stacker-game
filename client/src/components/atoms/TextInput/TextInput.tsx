import { TextInputProps } from "@client/components/atoms/TextInput/@types/TextInput"
import { getInputColor } from "@client/components/atoms/TextInput/styles"
import { forwardRef } from "react"

const _TextInput: React.ForwardRefRenderFunction<
  HTMLInputElement,
  TextInputProps
> = (
  {
    className = "",
    disabled,
    hasError,
    onBlur,
    onChange,
    placeholder,
    required,
    value,
    ...otherProps
  },
  ref,
) => (
  <input
    className={`input input-bordered ${getInputColor({
      disabled,
      hasError,
    })} w-full ${className}`}
    disabled={disabled}
    onBlur={onBlur}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    ref={ref}
    type="text"
    value={value}
    {...otherProps}
  />
)

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  _TextInput,
)
