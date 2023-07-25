import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { App } from "@client/App"
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs"

dayjs.extend(relativeTime)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
