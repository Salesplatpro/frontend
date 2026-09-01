/* eslint-env es6 */
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// vitest globals are disabled, so @testing-library/react's automatic
// afterEach cleanup never registers — unmount rendered trees ourselves to
// keep each test's DOM isolated.
afterEach(() => {
  cleanup()
})

// jsdom has no <canvas> implementation; lottie-web (pulled in via App) calls
// canvas.getContext() at module-load time and crashes without this stub.
// See: https://github.com/jsdom/jsdom/issues/2032
const context2d = new Proxy(
  {},
  {
    get: () => () => undefined,
    set: () => true,
  },
) as unknown as CanvasRenderingContext2D

HTMLCanvasElement.prototype.getContext = (() =>
  context2d) as unknown as typeof HTMLCanvasElement.prototype.getContext

Element.prototype.scrollIntoView = () => undefined
