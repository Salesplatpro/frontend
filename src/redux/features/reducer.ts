import { combineReducers } from '@reduxjs/toolkit'

import { api } from '../api/apiSlice'
import { recruiterApi } from '../api/recruiter'
import { talentApi } from '../api/talent'

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [talentApi.reducerPath]: talentApi.reducer,
  [recruiterApi.reducerPath]: recruiterApi.reducer,
})

export default rootReducer
