import { config } from "@client/config"
import _axios from "axios"

export const axios = _axios.create({
  baseURL: config.api.httpBaseUrl,
})
