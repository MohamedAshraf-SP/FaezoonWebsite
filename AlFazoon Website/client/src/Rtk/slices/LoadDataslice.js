import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllItems } from "../../Services/TutorialService";

// function to load all data
export const fetchData = createAsyncThunk(
  "data/fetchAll",
  async (path, thunkAPI) => {
    try {
      const data = await getAllItems(path); // Assuming getAllItems takes just the path
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const loadDataSlice = createSlice({
  name: "loadData",
  initialState: {
    results: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "Loading...";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "success";
        state.results = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default loadDataSlice.reducer;
