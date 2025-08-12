import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchWithWord } from "../../Services/TutorialService";

// Async thunk to handle API request
export const fetchSearchResult = createAsyncThunk(
  "search/fetchsearchresult",
  async ({ path, searchWord }, thunkAPI) => {
    const response = await searchWithWord(path, searchWord);

    return response;
  }
);
// create slice
const searchSlice = createSlice({
  name: "Search",
  initialState: {
    searchValue: "",
    searchresult: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResult.pending, (state) => {
        state.status = "Loading...";
      })
      .addCase(fetchSearchResult.fulfilled, (state, action) => {
        state.status = "Success";
        state.searchresult = action.payload;
      })
      .addCase(fetchSearchResult.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSearchValue } = searchSlice.actions;
export default searchSlice.reducer;
