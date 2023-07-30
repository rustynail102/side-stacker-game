import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { PageTemplate } from "@client/components/templates/PageTemplate/PageTemplate"
import { IconType } from "react-icons"
import { FiAlertCircle } from "react-icons/fi"

export const NotFoundContainer: React.FC = () => (
  <PageTemplate>
    <Alert icon={FiAlertCircle as IconType} type={AlertType.Error}>
      Page Not Found
    </Alert>
  </PageTemplate>
)
