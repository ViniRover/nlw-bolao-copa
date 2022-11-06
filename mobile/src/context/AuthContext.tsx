import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { axiosApi } from '../services/axiosApi'

WebBrowser.maybeCompleteAuthSession()

interface UserData {
  name: string
  avatarUrl: string
}

export interface AuthContextData {
  user: UserData
  isUserLoading: boolean
  signIn: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [isUserLoading, setIsUserLoading] = useState(false)
  const [user, setUser] = useState<UserData>({} as UserData)

  const [, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: process.env.REDIRECT_URI,
    scopes: ['profile', 'email'],
  })

  useEffect(() => {
    if (response?.type === 'success' && response?.authentication.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  async function signIn() {
    try {
      setIsUserLoading(true)
      await promptAsync()
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  async function signInWithGoogle(accessToken: string) {
    try {
      setIsUserLoading(true)

      const tokenResponse = await axiosApi.post('/users', {
        accessToken,
      })
      axiosApi.defaults.headers.common.Authorization = `Bearer ${tokenResponse.data.token}`

      const userInfoResponse = await axiosApi.get('/me')
      setUser(userInfoResponse.data.user)
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        user,
        isUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
