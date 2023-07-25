import { AlertType } from "@client/components/molecules/Alert/@types/Alert"

export const mapAlertTypeToStyles: Record<
  AlertType,
  {
    container: string
    icon: string
  }
> = {
  [AlertType.Default]: {
    container: "",
    icon: "stroke-current",
  },
  [AlertType.Success]: {
    container: "alert-success",
    icon: "stroke-current",
  },
  [AlertType.Warning]: {
    container: "alert-warning",
    icon: "stroke-current",
  },
  [AlertType.Error]: {
    container: "alert-error",
    icon: "stroke-current",
  },
  [AlertType.Primary]: {
    container: "",
    icon: "stroke-primary",
  },
  [AlertType.Secondary]: {
    container: "",
    icon: "stroke-secondary",
  },
  [AlertType.Accent]: {
    container: "",
    icon: "stroke-accent",
  },
}
