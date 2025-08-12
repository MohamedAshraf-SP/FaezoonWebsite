import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { editItem } from "../../Services/TutorialService";

// update Func
export const updateData = createAsyncThunk(
  "data/updateData",
  async ({ path, itemId, updatedItem, thunkAPI }) => {
     try {
      const data = await editItem(path, itemId, updatedItem);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
const updateSlice = createSlice({
  name: "updateSlice",
  initialState: {
    updateResults: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateData.pending, (state) => {
        state.status = "loading...";
      })
      .addCase(updateData.fulfilled, (state) => {
        state.status = "success...";
        state.updateResults.push(action.payload);
      })
      .addCase(updateData.rejected, (state, action) => {
        state.status = "faild...";
        state.error = action.payload || action.error.message;
      });
  },
});
