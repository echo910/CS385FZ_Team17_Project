/**
 * 用户认证状态管理 Context
 */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isLoggedIn: false,
  user: null,
  isLoading: true,
};

const ActionTypes = {
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
};

function authReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
        isLoading: false,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        isLoading: false,
      };
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

const AuthContext = createContext(null);

const STORAGE_KEY = "@auth_user";

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEY);
      if (userData) {
        dispatch({ type: ActionTypes.SET_USER, payload: JSON.parse(userData) });
      } else {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.warn("Failed to load user:", error);
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const login = async (email, password) => {
    // 模拟登录 - 实际项目中应该调用后端 API
    const user = {
      id: `user_${Date.now()}`,
      email,
      name: email.split("@")[0],
      avatar: null,
      level: 6,
      vip: false,
      followers: 2400,
      following: 128,
      likes: 8600,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    dispatch({ type: ActionTypes.SET_USER, payload: user });
    return user;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const updateUser = async (updates) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      dispatch({ type: ActionTypes.SET_USER, payload: updatedUser });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
