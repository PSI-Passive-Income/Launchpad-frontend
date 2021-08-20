import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { kebabCase } from 'lodash'
import { Toast, toastTypes } from '../../components/Toast'
import { ToastsState } from '../types'

const initialState: ToastsState = {
  data: [],
}

export const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    push: (state: ToastsState, action: PayloadAction<Toast>) => {
      const { payload } = action
      const toastIndex = state.data.findIndex((toast) => toast.id === action.payload.id)

      // If id already matches remove it before adding it to the top of the stack
      if (toastIndex >= 0) {
        state.data.splice(toastIndex, 1)
      }

      state.data.unshift(payload)
    },
    remove: (state: ToastsState, action: PayloadAction<string>) => {
      const toastIndex = state.data.findIndex((toast) => toast.id === action.payload)

      if (toastIndex >= 0) {
        state.data.splice(toastIndex, 1)
      }
    },
    clear: (state: ToastsState) => {
      // eslint-disable-next-line no-param-reassign
      state.data = []
    },
  },
})

// Actions
export const { clear, remove, push } = toastsSlice.actions

// Functions
export const toastError = (title: string, description?: string) => {
  return push({ id: kebabCase(title), type: toastTypes.DANGER, title, description })
}
export const toastInfo = (title: string, description?: string) => {
  return push({ id: kebabCase(title), type: toastTypes.INFO, title, description })
}
export const toastSuccess = (title: string, description?: string) => {
  return push({ id: kebabCase(title), type: toastTypes.SUCCESS, title, description })
}
export const toastWarning = (title: string, description?: string) => {
  return push({ id: kebabCase(title), type: toastTypes.WARNING, title, description })
}

export default toastsSlice.reducer
