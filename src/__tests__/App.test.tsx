import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'

import App from '../App'
import { store } from '../redux/store/store'

/**
 * @vitest-environment jsdom
 */

describe('App page', () => {
  it('renders page', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    )

    expect(screen.getByTestId('app-page')).toBeTruthy()
  })
})
