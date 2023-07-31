import toast from "react-hot-toast"

const calculateAutoCloseTime = (message: string) => {
  const time = message.length * 80

  return time <= 2000 ? 2000 : time
}

/**
 * Hook that provides functions for showing success and error toasts.
 * The duration of the toast is calculated based on the length of the message.
 * @returns {Object} - The functions for showing success and error toasts.
 */
export const useToast = () => {
  const errorToast = (message: string) => {
    toast.error(message, {
      duration: calculateAutoCloseTime(message),
      position: "top-right",
    })
  }

  const successToast = (message: string) => {
    toast.success(message, {
      duration: calculateAutoCloseTime(message),
      position: "top-right",
    })
  }

  return {
    errorToast,
    successToast,
  }
}
