import { ExternalToast, toast } from 'sonner'

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading'

interface NotifyOptions extends ExternalToast {
  /** react-toastify-era option name, mapped to sonner's `duration` below. */
  autoClose?: number
  /** react-toastify-only options accepted for source compatibility with
   * existing call sites and intentionally ignored under sonner. */
  transition?: unknown
  hideProgressBar?: boolean
  progress?: unknown
  pauseOnHover?: boolean
  draggable?: boolean
  closeOnClick?: boolean
}

export const notify = (
  type: ToastType,
  message: string,
  options?: NotifyOptions,
) => {
  // react-toastify-only keys (transition, hideProgressBar, progress,
  // pauseOnHover, draggable, closeOnClick) may still be present on `rest`
  // from pre-migration call sites; sonner ignores unrecognized options.
  const { autoClose, ...rest } = options ?? {}

  return toast[type](message, { duration: autoClose ?? 2000, ...rest })
}

// Thin re-export so promise-based flows still go through this single wrapper
// file rather than importing sonner directly elsewhere.
export const notifyPromise = toast.promise
