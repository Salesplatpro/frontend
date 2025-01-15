import { Bounce, Slide, toast, ToastOptions } from 'react-toastify'

type ToastType = 'success' | 'error' | 'info' | 'warning'

export const notify = (
  type: ToastType,
  message: string,
  options?: ToastOptions,
) => {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: type === 'success' ? Slide : Bounce,
  }

  toast[type](message, { ...defaultOptions, ...options })
}
