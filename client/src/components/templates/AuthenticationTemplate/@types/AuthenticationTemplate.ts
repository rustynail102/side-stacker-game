import { ColumnFlexBasis } from "@client/components/atoms/Column/@types/Column"
import { DividerProps } from "@client/components/atoms/Divider/@types/Divider"
import { ReactNode } from "react"

export interface AuthenticationTemplateProps {
  children: ReactNode | ReactNode[]
  dividerText?: DividerProps["children"]
  flexBasis?: ColumnFlexBasis
}
