import { Toaster } from "react-hot-toast"

const withToastsProvider =
  (WrappedComponent: React.FC<Record<string, unknown>>) =>
  (props: Record<string, unknown>) => (
    <>
      <WrappedComponent {...props} />
      <div>
        <Toaster />
      </div>
    </>
  )

export { withToastsProvider }
