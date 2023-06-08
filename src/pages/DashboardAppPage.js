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
import {clearMessages, list as getMessages, send} from "../features/messageSlice";
import {clearMembers, list as getMembers} from "../features/memberSlice";
import Scrollbar from "../components/scrollbar";
import {logOut} from "../features/userSlice";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const {user} = useSelector(store => store.user);
  const {currentConversation} = useSelector(store => store.conversation);
  const {messages} = useSelector(store => store.message);
  const {members} = useSelector(store => store.member);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
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
    if (!!user) {
      dispatch(list());
    } else {
      dispatch(clearConversations());
      dispatch(clearMessages());
      dispatch(clearMembers());
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
      dispatch(send(message));
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
          <ScrollToBottom>
            <Stack
                sx={{
                  bgColor: "white",
                  gap: 2,
                  maxHeight: "calc(100% - 68px)"
                }}
            >
              {currentConversation?.id && messages[currentConversation.id] && messages[currentConversation.id].map(message => {
                const isCurrentUserMessage = message.UserId === user?.id;
                const member = members[currentConversation.id]?.find(member => member.UserId === message.UserId);
                return <Stack
                    sx={{
                      bgcolor: "secondary",
                      ml: isCurrentUserMessage ? "auto" : "0",
                    }}
                >
                  {!isCurrentUserMessage && member?.User.displayName && <Typography>{member.User.displayName}</Typography>}
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
                transform: "translateX(-50%)"
              }}
          >
            <Input
                value={text}
                onChange={(event) => {
                  setText(event.target.value)
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
