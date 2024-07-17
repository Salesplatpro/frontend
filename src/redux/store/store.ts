import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../features/reducer'
import { api } from '../api/apiSlice'
import { talentApi } from '../api/talent'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, talentApi.middleware),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
})

export type RootState = ReturnType<typeof rootReducer>
