import { composeFunctions } from "@app/helpers/functions/composeFunctions"
import { withQueryClientProvider } from "@app/hoc/withQueryClientProvider"
import { router } from "@app/routing"
import { RouterProvider } from "@tanstack/router"

import "@app/styles/global.css"

const _App: React.FC = () => <RouterProvider router={router} />

export const App = composeFunctions<Record<string, unknown>>(
  withQueryClientProvider,
)(_App)
