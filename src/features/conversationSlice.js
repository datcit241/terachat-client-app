import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import agent from "../api/agent";

const initialState = {
  conversations: [],
  currentConversation: null,
  isLoading: false,
  hasError: false,
};

export const list = createAsyncThunk('conversation/list',
    async (body) => {
      return agent.Conversations.list(body)
    }
);

export const create = createAsyncThunk('conversation/create',
    async (body, {dispatch}) => {
      return agent.Conversations.create(body)
    }
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setCurrentConversation: (state, {payload}) => {
      state.currentConversation = payload;
    },
    clearConversations: () => initialState
  },
  extraReducers: ({addCase}) => {
    addCase(list.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    });
    addCase(list.fulfilled, (state, action) => {
      state.conversations = action.payload.conversations;
      state.isLoading = false;
      state.hasError = false;
    });
    addCase(list.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
      console.log("error")
    });
    addCase(create.pending, (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    });
    addCase(create.fulfilled, (state, action) => {
      state.conversations = [...state.conversations, action.payload];
      state.currentConversation = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });
    addCase(create.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    });
  }
})

export default conversationSlice.reducer;
export const {setCurrentConversation, clearConversations} = conversationSlice.actions;
