// context/AuthContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase'

export interface SimpleUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL?: string | null
}

interface AuthContextType {
  user: User | SimpleUser | null
  loading: boolean
  isConfigured: boolean
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  registerWithEmail: (
    email: string,
    pass: string,
    displayName?: string
  ) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const LOCAL_USER_KEY = 'pec_summit_auth_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | SimpleUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Read local cache on client mount
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY)
      if (saved) {
        setUser(JSON.parse(saved))
      }
    } catch {}

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
          const userObj: SimpleUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }
          setUser(firebaseUser)
          try {
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userObj))
          } catch {}
        } else {
          // If explicitly signed out in Firebase
          const hasLocal = localStorage.getItem(LOCAL_USER_KEY)
          if (!hasLocal) {
            setUser(null)
          }
        }
        setLoading(false)
      })
      return () => unsubscribe()
    } else {
      try {
        const saved = localStorage.getItem(LOCAL_USER_KEY)
        if (saved) {
          setUser(JSON.parse(saved))
        }
      } catch (e) {
        console.warn('Error reading local auth user:', e)
      }
      setLoading(false)
    }
  }, [])

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true)
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass)
        const u = userCredential.user
        const userObj: SimpleUser = {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || email.split('@')[0],
          photoURL: u.photoURL,
        }
        setUser(u)
        try {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userObj))
        } catch {}
        setLoading(false)
        return { success: true }
      } catch (err: any) {
        setLoading(false)
        const message = err?.message?.replace('Firebase: ', '') || 'Failed to sign in.'
        return { success: false, error: message }
      }
    } else {
      const mockUser: SimpleUser = {
        uid: `usr_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
      }
      setUser(mockUser)
      try {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser))
      } catch {}
      setLoading(false)
      return { success: true }
    }
  }

  const registerWithEmail = async (email: string, pass: string, displayName?: string) => {
    setLoading(true)
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass)
        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName })
        }
        const u = userCredential.user
        const userObj: SimpleUser = {
          uid: u.uid,
          email: u.email,
          displayName: displayName || u.displayName || email.split('@')[0],
          photoURL: u.photoURL,
        }
        setUser(u)
        try {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userObj))
        } catch {}
        setLoading(false)
        return { success: true }
      } catch (err: any) {
        setLoading(false)
        const message = err?.message?.replace('Firebase: ', '') || 'Failed to create account.'
        return { success: false, error: message }
      }
    } else {
      const mockUser: SimpleUser = {
        uid: `usr_${Date.now()}`,
        email,
        displayName: displayName || email.split('@')[0],
      }
      setUser(mockUser)
      try {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser))
      } catch {}
      setLoading(false)
      return { success: true }
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const userCredential = await signInWithPopup(auth, googleProvider)
        const u = userCredential.user
        const userObj: SimpleUser = {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || u.email?.split('@')[0] || 'Attendee',
          photoURL: u.photoURL,
        }
        setUser(u)
        try {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userObj))
        } catch {}
        setLoading(false)
        return { success: true }
      } catch (err: any) {
        setLoading(false)
        const message = err?.message?.replace('Firebase: ', '') || 'Google sign-in was cancelled.'
        return { success: false, error: message }
      }
    } else {
      const mockUser: SimpleUser = {
        uid: `g_${Date.now()}`,
        email: 'innovator@pec.edu.in',
        displayName: 'E-Summit Attendee',
      }
      setUser(mockUser)
      try {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser))
      } catch {}
      setLoading(false)
      return { success: true }
    }
  }

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email)
        return { success: true }
      } catch (err: any) {
        const message = err?.message?.replace('Firebase: ', '') || 'Failed to send password reset email.'
        return { success: false, error: message }
      }
    } else {
      return { success: true }
    }
  }

  const logout = async () => {
    setLoading(true)
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth)
      } catch (err) {
        console.warn('Error signing out:', err)
      }
    }
    setUser(null)
    try {
      localStorage.removeItem(LOCAL_USER_KEY)
      localStorage.removeItem('pec_summit_access_token')
      localStorage.removeItem('pec_summit_auth_token')
      localStorage.removeItem('pec_summit_registrations')
      localStorage.removeItem('pec_user_pass_applications')
      localStorage.removeItem('pec_summit_attendee_profile')
      localStorage.removeItem('pec_checkout_draft')
      sessionStorage.clear()
    } catch {}
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isFirebaseConfigured,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
