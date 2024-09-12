import { combineReducers } from '@reduxjs/toolkit'

import { api } from '../api/apiSlice'
import { recruiterApi } from '../api/recruiter'
import { talentApi } from '../api/talent'
import authSlice from './authSlice/authSlice'
import fileSlice from './filesSlice/fileSlice'

const rootReducer = combineReducers({
  file: fileSlice,
  auth: authSlice,
  [api.reducerPath]: api.reducer,
  [talentApi.reducerPath]: talentApi.reducer,
  [recruiterApi.reducerPath]: recruiterApi.reducer,
})

export default rootReducer
