import { configureStore } from '@reduxjs/toolkit'
import dataSliceReducer from "./slices/dataSlice"


export default configureStore({
  reducer: {
    dataSlice:dataSliceReducer
  }
})