import {Helmet} from 'react-helmet-async';
import {faker} from '@faker-js/faker';
// @mui
import {useTheme} from '@mui/material/styles';
import {Grid, Container, Typography, Input, Stack, Button, TextField, Paper} from '@mui/material';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Send} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import ReactEmoji from "react-emoji";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
// components
import Iconify from '../components/iconify';
// sections

import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import agent from "../api/agent";
import {clearConversations, list} from "../features/conversationSlice";
import {addMessage, clearMessages, list as getMessages, send} from "../features/messageSlice";
import {clearMembers, list as getMembers} from "../features/memberSlice";
import Scrollbar from "../components/scrollbar";
import {logOut} from "../features/userSlice";
import NewConversation from "../components/chat/NewConversation";
import {ConversationInfo} from "../components/chat/ConvesationInfo";

// ----------------------------------------------------------------------

let socket;
export default function DashboardAppPage() {
  const theme = useTheme();
  const {user} = useSelector(store => store.user);
  const {currentConversation} = useSelector(store => store.conversation);
  const {messages} = useSelector(store => store.message);
  const {members} = useSelector(store => store.member);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket = io(`ws://${process.env.REACT_APP_API_BASE_URL}`)
    if (!user) {
      navigate("/login");
    }
    const currentUser = agent.Auth.current();
    if (!currentUser) {
      dispatch(logOut());
      navigate("/login");
    }
  }, [])

  useEffect(() => {
    socket?.on("welcome", (message) => console.log(message));
  }, [socket])

  useEffect(() => {
    if (!!user) {
      if (socket) {
        socket.emit("addUser", user.id);
        socket.on("getMessage", message => {
          console.log(message);
          dispatch(addMessage(message));
        })
      }
      dispatch(list());
    } else {
      dispatch(clearConversations());
      dispatch(clearMessages());
      dispatch(clearMembers());
      navigate("/login");
    }
  }, [user])

  useEffect(() => {
    if (currentConversation) {
      if (!messages[currentConversation.id]) {
        dispatch(getMessages(currentConversation.id));
      }
      if (!members[currentConversation.id]) {
        dispatch(getMembers(currentConversation.id));
      }
    }
  }, [currentConversation]);

  const [text, setText] = useState("");

  const handleSend = () => {
    if (text && currentConversation) {
      const message = {
        conversationId: currentConversation.id,
        text,
      };
      dispatch(send({
        message, callback: (messageId) => {
          console.log(socket);
          socket?.emit("sendMessage", messageId)
        }
      }));
      setText("");
    }
  }

  return (
      <>
        <Helmet>
          <title>Terachat</title>
        </Helmet>
        <Container
            maxWidth="xl"
        >
          <NewConversation/>
          <ConversationInfo/>
          <ScrollToBottom>
            <Stack
                sx={{
                  bgColor: "white",
                  gap: 2,
                  maxHeight: "calc(100% - 68px)"
                }}
            >
              {currentConversation?.id && messages[currentConversation.id] && messages[currentConversation.id].map((message, index) => {
                const isCurrentUserMessage = message.UserId === user?.id;
                const member = members[currentConversation.id]?.find(member => member.UserId === message.UserId);
                return <Stack
                    key={index}
                    sx={{
                      ml: isCurrentUserMessage ? "auto" : "0",
                    }}
                >
                  {!isCurrentUserMessage && member?.User.displayName &&
                      <Typography>{member.User.displayName}</Typography>}
                  <Paper
                      sx={{
                        width: "fit-content",
                        p: 2,
                      }}
                  >
                    {ReactEmoji.emojify(message.text)}
                  </Paper>
                  <ReactTimeAgo date={message.createdAt} locale="vi-vn"/>
                </Stack>
              })}
            </Stack>
          </ScrollToBottom>

          <Stack
              direction="row"
              sx={{
                [theme.breakpoints.up("md")]: {
                  width: "50%",
                },
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
                padding: 2,
                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: theme.palette.grey[200],
              }}
          >
              <Input
                value={text}
                onChange={(event) => {
                  setText(event.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) handleSend();
                }}
                sx={{flex: "1"}}
            />
            <Button onClick={handleSend}>
              <Send/>
            </Button>
          </Stack>
        </Container>
      </>
  );
}
