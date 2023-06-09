import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';
import {NavLink as RouterLink} from 'react-router-dom';
import {useEffect, useState} from "react";
// @mui
import {Box, List, ListItemText, Stack} from '@mui/material';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
//
import {StyledNavItem, StyledNavItemIcon} from './styles';
import {setCurrentConversation} from "../../features/conversationSlice";
import {getDescriptionName} from "../../features/getDescriptionName";

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

function Item(props) {
  const {title, conversation, currentConversation, icon, info} = props;
  const dispatch = useDispatch();
  const {members} = useSelector(store => store.member);
  const {user} = useSelector(store => store.user);
  const [name, setName] = useState(title);

  useEffect(() => {
    if (!title) {
      setName(getDescriptionName({members: members[conversation?.id], user}) || "Conversation");
    }
  }, [])

  useEffect(() => {
    if (!title) {
      setName(getDescriptionName({members: members[conversation?.id], user}) || "Conversation");
    }
  }, [conversation, members, user]);

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

        <ListItemText primary={name}/>

        {info && info}
      </StyledNavItem>
  );
}
