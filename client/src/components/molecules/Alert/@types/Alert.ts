import { ReactNode } from "react"
import { IconType } from "react-icons"

export enum AlertType {
  Default,
  Success,
  Warning,
  Error,
  Primary,
  Secondary,
  Accent,
}

export interface AlertProps {
  children: ReactNode | ReactNode[]
  icon?: IconType
  type?: AlertType
}
