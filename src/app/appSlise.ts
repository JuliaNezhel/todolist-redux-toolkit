import { Dispatch } from "redux"
import { authAPI } from "../api/todolists-api"
import { authAction } from "features/Login/authSlise"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { AppThunk } from "./store"

const slise = createSlice({
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  name: "app",
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  selectors: {
    selectAppStatus: (sliseState) => sliseState.status,
    selectAppError: (sliseState) => sliseState.error,
    selectIsInitialized: (sliseState) => sliseState.isInitialized,
  },
})

export const appReducer = slise.reducer
export const appAction = slise.actions
export const { selectAppStatus, selectAppError, selectIsInitialized } = slise.selectors

export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(authAction.setIsLoggedIn({ value: true }))
    } else {
    }

    dispatch(appAction.setAppInitialized({ isInitialized: true }))
  })
}

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type AppInitialState = ReturnType<typeof slise.getInitialState>
