import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

export const TestQueryClientWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
