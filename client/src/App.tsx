import { composeFunctions } from "@client/helpers/functions/composeFunctions"
import { withQueryClientProvider } from "@client/hoc/withQueryClientProvider"
import { router } from "@client/routing"
import { RouterProvider } from "@tanstack/router"
import { withToastsProvider } from "@client/hoc/withToastsProvider"
import { withErrorBoundary } from "@client/hoc/withErrorBoundary"

import "@client/styles/global.css"

const _App: React.FC = () => <RouterProvider router={router} />

export const App = composeFunctions<Record<string, unknown>>(
  withToastsProvider,
  withQueryClientProvider,
  withErrorBoundary,
)(_App)
