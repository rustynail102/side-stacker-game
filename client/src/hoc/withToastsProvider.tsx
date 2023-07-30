import { Toaster } from "react-hot-toast"

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
