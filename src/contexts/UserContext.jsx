// src/contexts/UserContext.jsx
'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const UserContext = createContext();

// User actions
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_PREFERENCES: 'SET_PREFERENCES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_USER: 'CLEAR_USER'
};

// User reducer
function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null
      };

    case USER_ACTIONS.SET_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case USER_ACTIONS.CLEAR_USER:
      return {
        ...state,
        user: null,
        preferences: {},
        error: null
      };

    default:
      return state;
  }
}

// Initial state
const initialState = {
  user: null,
  preferences: {
    theme: 'light',
    currency: 'USD',
    language: 'en'
  },
  isLoading: true,
  error: null
};

// Context provider
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { data: session, status } = useSession();

  // Update user when session changes
  useEffect(() => {
    if (status === 'loading') {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    } else if (status === 'authenticated' && session?.user) {
      dispatch({ type: USER_ACTIONS.SET_USER, payload: session.user });
    } else {
      dispatch({ type: USER_ACTIONS.CLEAR_USER });
    }
  }, [session, status]);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        dispatch({ 
          type: USER_ACTIONS.SET_PREFERENCES, 
          payload: parsedPreferences 
        });
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  // Action creators
  const updatePreferences = (newPreferences) => {
    dispatch({ 
      type: USER_ACTIONS.SET_PREFERENCES, 
      payload: newPreferences 
    });
  };

  const setError = (error) => {
    dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: USER_ACTIONS.SET_ERROR, payload: null });
  };

  const value = {
    // State
    user: state.user,
    preferences: state.preferences,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: !!state.user,
    
    // Actions
    updatePreferences,
    setError,
    clearError
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}