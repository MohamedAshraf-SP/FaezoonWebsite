import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteItem } from "../../Services/TutorialService";

// Delete Function
export const deleteData = createAsyncThunk(
  "data/deleteData",
  async ({ path, itemId, thunkAPI }) => {
 
    try {
      const response = await deleteItem(path, itemId);
  
      return response; // Assuming response contains success message
    } catch (error) {
      // Ensure error handling captures the correct structure
      const errorMessage = error.response
        ? error.response.data
        : "Failed to delete item";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const deleteSlice = createSlice({
  name: "deleteSlice",
  initialState: {
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Optionally, you can add logic here to handle the response
        // For example, you could remove the item from a list in the state
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Handle the error message
      });
  },
});

export default deleteSlice.reducer;
