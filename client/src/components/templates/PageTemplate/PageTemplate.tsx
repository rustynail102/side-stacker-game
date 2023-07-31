import { PageTemplateProps } from "@client/components/templates/PageTemplate/@types/PageTemplate"

/**
 * A generic page template component. It provides a layout that can be used for any page in the application.
 */
export const PageTemplate: React.FC<PageTemplateProps> = ({ children }) => (
  <div className="max-w-7xl p-4 mx-auto flex items-start justify-between gap-4">
    {children}
  </div>
)
