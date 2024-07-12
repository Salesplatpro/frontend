import { createSlice } from '@reduxjs/toolkit'
import { getToken, getUserFromToken } from '../../../utils/authUtils'

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isLoggedIn: !!getToken(),
  loading: false,
  error: null,
  token: getToken(),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true
    },
    loginSuccess(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      state.isLoggedIn = true
      state.loading = false
    },
    loginFailure(state, action) {
      state.error = action.payload
      state.loading = false
    },
    logout(state) {
      state.user = null
      state.isLoggedIn = false
      state.loading = false
      state.error = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    setUser(state, action) {
      state.user = action.payload.user
      state.isLoggedIn = true
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setUser } =
  authSlice.actions
export default authSlice.reducer
