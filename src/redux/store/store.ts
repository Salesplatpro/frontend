import { configureStore } from '@reduxjs/toolkit'

import { api } from '../api/apiSlice'
import { recruiterApi } from '../api/recruiter'
import { talentApi } from '../api/talent'
import rootReducer from '../features/reducer'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'file/setFiles',
          'file/addFiles',
          'file/addCvCoverLetter',
          'file/setCvCoverLetter',
        ],
        ignoredPaths: ['file.files', 'file.cvCoverLetter', 'file.results'],
      },
    }).concat(api.middleware, talentApi.middleware, recruiterApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof rootReducer>
