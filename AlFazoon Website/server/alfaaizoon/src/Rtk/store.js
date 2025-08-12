import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slices/SearchSlice";
import LaodDataSlice from "./slices/LoadDataslice";
import deleteSlice from "./slices/deleteDataSlice";
export const store = configureStore({
  reducer: {
    search: searchReducer,
    fetchedData: LaodDataSlice,
    deleteData: deleteSlice,
    // Add your reducers here
  },
});
