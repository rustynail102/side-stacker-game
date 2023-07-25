import { composeFunctions } from "@client/helpers/functions/composeFunctions"
import { withQueryClientProvider } from "@client/hoc/withQueryClientProvider"
import { router } from "@client/routing"
import { RouterProvider } from "@tanstack/router"

import "@client/styles/global.css"

const _App: React.FC = () => <RouterProvider router={router} />

export const App = composeFunctions<Record<string, unknown>>(
  withQueryClientProvider,
)(_App)
