export enum LogoSize {
  Sm,
  Lg,
}
export interface LogoProps {
  className?: {
    img?: string
  }
  size?: LogoSize
}
