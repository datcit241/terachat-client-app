import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import agent from "../api/agent";

const initialState = {
  messages: {},
  isLoading: false,
  hasError: false,
};

export const list = createAsyncThunk('message/list',
    async (body) => {
      return agent.Messages.list(body)
    }
);

export const send = createAsyncThunk('message/send',
    async ({message, callback}, {dispatch}) => {
      const msg = await agent.Messages.send(message)
      if (msg) {
        callback(msg.id);
      }
      return msg;
    }
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    addMessage: (state, {payload: message}) => {
      if (!state.messages[message.ConversationId]) {
        state.messages[message.ConversationId] = [message];
      } else if (!state.messages[message.ConversationId].some(msg => msg.id === message.id)) {
        state.messages[message.ConversationId] = [...state.messages[message.ConversationId], message];
      }
    },
    clearMessages: () => initialState,
  },
  extraReducers: ({addCase}) => {
    addCase(list.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    });
    addCase(list.fulfilled, (state, {payload: {messages}}) => {
      if (messages.length) {
        state.messages[messages[0].ConversationId] = [...messages];
      }
      state.isLoading = false;
      state.hasError = false;
    });
    addCase(list.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
      console.log("error")
    });
    addCase(send.pending, (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    });
    addCase(send.fulfilled, (state, {payload: message}) => {
      console.log(message);
      state.messages[message.ConversationId] = [...state.messages[message.ConversationId], message];
      state.isLoading = false;
      state.hasError = false;
    });
    addCase(send.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    });
  }
})

export default conversationSlice.reducer;
export const {addMessage, clearMessages} = conversationSlice.actions;
