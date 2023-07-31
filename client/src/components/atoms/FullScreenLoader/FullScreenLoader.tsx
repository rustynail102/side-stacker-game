/**
 * A full screen loading indicator.
 */
export const FullScreenLoader: React.FC = () => (
  <div className="flex items-center justify-center w-[100vw] h-[100vh] base-100">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
)
