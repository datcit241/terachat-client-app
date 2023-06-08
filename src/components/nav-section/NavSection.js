import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';
import {NavLink as RouterLink} from 'react-router-dom';
import {useState} from "react";
// @mui
import {Box, List, ListItemText, Stack} from '@mui/material';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
//
import {StyledNavItem, StyledNavItemIcon} from './styles';
import {setCurrentConversation} from "../../features/conversationSlice";

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({data = [], ...other}) {
  const {conversations, currentConversation} = useSelector(store => store.conversation);
  return (
      <Box {...other}>
        <List disablePadding sx={{p: 1}}>
          {conversations.map((conversation, index) => <Item key={index} {...{
            title: conversation.displayName,
            conversation,
            currentConversation
          }}/>)}
        </List>
      </Box>
  );
}

// ----------------------------------------------------------------------

function getDescriptionName({members, user}) {
  let name;
  if (members && user) {
    if (members?.length === 2) {
      name = members.find(member => member.UserId !== user.Id).User.displayName;
    } else {
      const limit = 2;
      const names = members
          .filter(member => member.UserId !== user.Id)
          .map(member => member.User.displayName);
      name = names.slice(0, Math.min(limit, names.length)).join(", ");
      if (members.length > limit + 1) {
        name += `... +${members.length - limit + 1} others`
      }
    }
  }
  return name;
}

function Item(props) {
  const {title, conversation, currentConversation, icon, info} = props;
  const dispatch = useDispatch();
  const {members} = useSelector(store => store.member);
  const {user} = useSelector(store => store.user);

  const onClick = () => {
    if (conversation !== currentConversation) {
      dispatch(setCurrentConversation(conversation));
    }
  };

  const sx = currentConversation?.id === conversation?.id ? {
    color: 'text.primary',
    bgcolor: 'action.focus',
    fontWeight: 'fontWeightBold',
  } : {}

  return (
      <StyledNavItem
          onClick={onClick}
          sx={sx}
      >
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

        <ListItemText primary={title || getDescriptionName({members: members[conversation?.id], user}) || "Conversation"}/>

        {info && info}
      </StyledNavItem>
  );
}
