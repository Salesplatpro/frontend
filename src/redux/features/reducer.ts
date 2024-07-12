import authSlice from './authSlice/authSlice'
import { combineReducers } from '@reduxjs/toolkit'
import { api } from '../api/apiSlice'

const rootReducer = combineReducers({
  auth: authSlice,
  [api.reducerPath]: api.reducer,
})

export default rootReducer
