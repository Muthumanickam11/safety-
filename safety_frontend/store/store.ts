import { configureStore } from "@reduxjs/toolkit"
import contentReducer from "./content-slice"
import uiReducer from "./ui-slice"

export const store = configureStore({
  reducer: {
    content: contentReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
