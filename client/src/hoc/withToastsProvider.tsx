import { Toaster } from "react-hot-toast"

/**
 * Higher-order component that provides a Toaster from react-hot-toast to the wrapped component.
 * @param {React.FC<Record<string, unknown>>} WrappedComponent - The component to wrap with a Toaster.
 * @returns {React.FC<Record<string, unknown>>} - The component wrapped with a Toaster.
 */
export const withToastsProvider =
  (WrappedComponent: React.FC<Record<string, unknown>>) =>
  (props: Record<string, unknown>) => (
    <>
      <WrappedComponent {...props} />
      <div>
        <Toaster />
      </div>
    </>
  )
