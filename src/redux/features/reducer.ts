import authSlice from './authSlice/authSlice'
import { combineReducers } from '@reduxjs/toolkit'
import { api } from '../api/apiSlice'
import { talentApi } from '../api/talent'
import { recruiterApi } from '../api/recruiter'

const rootReducer = combineReducers({
  auth: authSlice,
  [api.reducerPath]: api.reducer,
  [talentApi.reducerPath]: talentApi.reducer,
  [recruiterApi.reducerPath]: recruiterApi.reducer,
})

export default rootReducer
