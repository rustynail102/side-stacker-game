import { queryClient } from "@client/clients/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const withQueryClientProvider =
  (WrappedComponent: React.FC<Record<string, unknown>>) =>
  (props: Record<string, unknown>) => (
    <QueryClientProvider client={queryClient}>
      <WrappedComponent {...props} />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  )

export { withQueryClientProvider }
