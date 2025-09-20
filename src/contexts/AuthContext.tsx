import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'user' | 'trainer') => Promise<void>;
  logout: () => void;
  updateProfile: (profile: any) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        isLoading: true 
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };
    case 'LOGIN_ERROR':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        isLoading: false 
      };
    case 'LOGOUT':
      return { 
        isAuthenticated: false, 
        user: null, 
        token: null,
        isLoading: false 
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, profile: action.payload } : null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true, // Start with loading true to check auth state
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // Validate the token with the server
          const apiUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/api/v1/auth/me'
            : '/api/v1/auth/me';
            
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const user = await response.json();
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, token },
            });
          } else {
            // Token is invalid, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.error('Error validating auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        // No token or user data, ensure we're logged out
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt with:', email);
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Use full URL in development to avoid CORS issues
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8000/api/v1/auth/login'
        : '/api/v1/auth/login';
      
      console.log('Calling login API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Important for cookies/session
        body: JSON.stringify({ email, password }),
      });
      
      const responseData = await response.json();
      console.log('Login response:', { status: response.status, data: responseData });
      
      if (!response.ok) {
        throw new Error(responseData.detail || 'Login failed');
      }
      
      if (!responseData.token) {
        throw new Error('No token received in response');
      }
      
      // Store the token and user data
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
      
      // Dispatch success action
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          token: responseData.token,
          user: responseData.user 
        } 
      });
      
      console.log('Login successful, user:', responseData.user);
      return responseData.user;
      
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ 
        type: 'LOGIN_ERROR', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, role: 'user' | 'trainer') => {
    console.log('Registration attempt for:', email, 'as', role);
    
    try {
      // Use full URL in development to avoid CORS issues
      const apiUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000/api/v1/auth/register'
        : '/api/v1/auth/register';
      
      console.log('Calling register API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, role }),
      });
      
      const responseData = await response.json();
      console.log('Register response:', { status: response.status, data: responseData });
      
      if (!response.ok) {
        throw new Error(responseData.detail || 'Registration failed');
      }
      
      if (!responseData.token) {
        throw new Error('No token received in response');
      }
      
      // Store the token and user data
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
      
      // Dispatch success action
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          token: responseData.token,
          user: responseData.user 
        } 
      });
      
      console.log('Registration successful, user:', responseData.user);
      return responseData.user;
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (profile: any) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  // Add loading state to the context value
  const contextValue = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};