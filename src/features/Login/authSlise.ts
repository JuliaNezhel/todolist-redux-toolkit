import { appAction } from 'app/appSlise';
import { Dispatch } from "redux"
import { authAPI, LoginParamsType } from "../../api/todolists-api"
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "app/store"
import { cleatTasksAndTodos } from 'common/action/common.action';

const slise = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ value: boolean }>) => {
      state.isLoggedIn = action.payload.value
    },
  },
})
export const authReducer = slise.reducer
export const authAction = slise.actions

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk =>
  (dispatch) => {
    dispatch(appAction.setAppStatus({status:"loading"}))
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(authAction.setIsLoggedIn({ value: true }))
          dispatch(appAction.setAppStatus({status:"succeeded"}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(appAction.setAppStatus({status:"loading"}))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authAction.setIsLoggedIn({ value: false }))
        dispatch(cleatTasksAndTodos())
        dispatch(appAction.setAppStatus({status:"succeeded"}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
