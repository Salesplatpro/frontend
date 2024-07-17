import authSlice from './authSlice/authSlice'
import { combineReducers } from '@reduxjs/toolkit'
import { api } from '../api/apiSlice'
import { talentApi } from '../api/talent'

const rootReducer = combineReducers({
  auth: authSlice,
  [api.reducerPath]: api.reducer,
  [talentApi.reducerPath]: talentApi.reducer,
})

export default rootReducer
