import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

interface UIState {
  isScheduleModalOpen: boolean
  toasts: Toast[]
}

const initialState: UIState = {
  isScheduleModalOpen: false,
  toasts: [],
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setScheduleModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isScheduleModalOpen = action.payload
    },
    addToast: (state, action: PayloadAction<Toast>) => {
      state.toasts.push(action.payload)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
  },
})

export const { setScheduleModalOpen, addToast, removeToast } = uiSlice.actions
export default uiSlice.reducer
