import React, {
  Children,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { SendTalentLogin } from '../api/api-communication'
import { FormTalentLogin } from '../utils/types'

type User = {
  email: string
  name: string
}

export type UserAuth = {
  isLoggedIn: boolean
  user: User | null
  login: (FormTalentLogin) => Promise<void>
  signIn: (email: string, name: string, password: string) => Promise<void>
  logout: () => Promise<void>
  userInfo: any
}

const AuthContext = createContext<UserAuth | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userInfo, setUserInfo] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const login = async (formValue: FormTalentLogin) => {
    const data = await SendTalentLogin(formValue)
    if (data) {
      setUser({ email: data.email, name: data.name })
      setIsLoggedIn(true)
      sessionStorage.setItem('authToken', data.data.token)
      sessionStorage.setItem('userInfo', JSON.stringify(data.data))
    }
    if (data.data.user.userRole === 'talents') {
      setUserInfo(data.data.user.profile.role[0]._id)
    }
    return data
  }

  const checkAuth = () => {
    const token = sessionStorage.getItem('authToken')
    const userInfos = sessionStorage.getItem('userInfo')

    if (token && userInfos) {
      setIsLoggedIn(true)
      setUserInfo(JSON.parse(userInfos))
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const signIn = async () => {}

  const logout = async () => {
    setUser(null)
    setIsLoggedIn(false)
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userInfo')
  }

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    signIn,
    userInfo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
