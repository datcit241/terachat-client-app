import {Edit} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab, FormControlLabel, FormGroup,
  List,
  ListItemButton, Stack, Switch, TextField, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import agent from "../../api/agent";
import {addConversation} from "../../features/conversationSlice";

const NewConversation = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const dispatch = useDispatch();

  const clear = () => {
    setSelectedUsers([]);
    setDisplayName("");
    setIsPrivate(true);
  }
  const handleClose = () => {
    setOpen(false);
    clear();
  };

  const handleChange = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter(u => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreate = () => {
    agent.Conversations.create({
      displayName,
      isPrivate,
      users: selectedUsers
    }).then(res => {
      dispatch(addConversation(res));
      console.log(res);
      handleClose();
    })
  }

  useEffect(() => {
    if (!users.length) {
      agent.Users.list().then(res => {
        console.log(res);
        setUsers(res);
      })
    }
  }, [])
  return <>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Create conversation"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {selectedUsers.length > 1 && <Stack direction="row" spacing={2} alignItems="center">
            <TextField
                label="Name" sx={{m: 1}}
                onChange={(e) => setDisplayName(e.target.value)}
            />
            <FormGroup>
              <FormControlLabel control={<Switch checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)}/>}
                                label="Private"/>
            </FormGroup>
          </Stack>}
          <Typography sx={{mt: 1}}>With:</Typography>
          <List>
            {
              selectedUsers
                  .map((user, index) => (
                      <ListItemButton
                          key={index}
                          sx={{bgcolor: "action.focus", m: 1, borderRadius: 8}}
                          onClick={() => handleChange(user)}>
                        {user.displayName}
                      </ListItemButton>
                  ))
            }
            {
              users
                  .filter(user => !selectedUsers.includes(user))
                  .map((user, index) => (
                      <ListItemButton
                          key={index}
                          sx={{m: 1, borderRadius: 8}}
                          onClick={() => handleChange(user)}>
                        {user.displayName}
                      </ListItemButton>
                  ))
            }
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
    <Fab color="secondary" aria-label="edit"
         sx={{
           position: "fixed",
           bottom: 16,
           right: 16
         }}
         onClick={() => setOpen(true)}
    >
      <Edit/>
    </Fab>
  </>

}

export default NewConversation;