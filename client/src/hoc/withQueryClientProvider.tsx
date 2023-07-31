import { queryClient } from "@client/clients/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

/**
 * Higher-order component that provides QueryClientProvider to the wrapped component.
 * Also includes ReactQueryDevtools for development.
 * @param {React.FC<Record<string, unknown>>} WrappedComponent - The component to wrap with QueryClientProvider.
 * @returns {React.FC<Record<string, unknown>>} - The component wrapped with QueryClientProvider.
 */
export const withQueryClientProvider =
  (WrappedComponent: React.FC<Record<string, unknown>>) =>
  (props: Record<string, unknown>) => (
    <QueryClientProvider client={queryClient}>
      <WrappedComponent {...props} />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  )
