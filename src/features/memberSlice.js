import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import agent from "../api/agent";

const initialState = {
  members: {},
  isLoading: false,
  hasError: false,
};

export const list = createAsyncThunk('members/list',
    async (body) => {
      return agent.Members.list(body)
    }
);

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    clearMembers: () => initialState
  },
  extraReducers: ({addCase}) => {
    addCase(list.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    });
    addCase(list.fulfilled, (state, {payload: {members}}) => {
      if (members.length) {
        state.members[members[0].ConversationId] = members;
      }
      state.isLoading = false;
      state.hasError = false;
    });
    addCase(list.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
      console.log("error")
    });
  }
})

export default memberSlice.reducer;
export const {clearMembers} = memberSlice.actions;
