import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    IconButton, List, ListItemButton,
    Stack, Switch,
    TextField, Typography
} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {ArrowBack, GroupAdd} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import agent from "../../../api/agent";
import {addConversation} from "../../../features/conversationSlice";

const GroupJoin = () => {
    const [open, setOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const {conversations} = useSelector(store => store.conversation);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [password, setPassword] = useState("");
    useEffect(() => {
        if (!groups.length) {
            agent
                .Conversations
                .listAll()
                .then(groups => groups?.conversations)
                .then(
                    (groups) => {
                        if (groups?.length) {
                            const filteredGroups = groups.filter(group => !conversations.some(conversation => conversation.id === group.id));
                            setGroups(filteredGroups);
                        } else {
                            setGroups(groups);
                        }
                    }
                );
        }
    }, [])

    const dispatch = useDispatch();
    const handleJoin = () => {
        if (selectedGroup) {
            agent
                .Conversations
                .join({conversationId: selectedGroup.id, password})
                .then((res) => {
                    dispatch(addConversation(selectedGroup));
                });
        }
        handleClose();
    }

    const handleClose = () => {
        setOpen(false);
        setPassword("");
        setSelectedGroup(null);
    }

    return <>
        <IconButton
            onClick={() => setOpen(true)}
            sx={{
                padding: 0,
                width: 44,
                height: 44,
                ...(open && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
                }),
            }}
        >
            <GroupAdd/>
        </IconButton>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Join a group"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {selectedGroup && <>
                        <IconButton
                            sx={{
                                padding: 0,
                                width: 44,
                                height: 44,
                                ...(open && {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
                                }),
                            }}
                        >
                            <ArrowBack onClick={() => setSelectedGroup(null)}/>
                        </IconButton>

                        <Typography
                            sx={{mt: 1}}>{`${selectedGroup.displayName || "Group"} - ${selectedGroup.id}`}</Typography>
                        {!selectedGroup.isPublic && <TextField sx={{mt: 1}} label="Password"
                                                               onChange={(event) => setPassword(event.target.value)}/>}
                    </>}
                    {!selectedGroup && <List>
                        {groups.map(group => <ListItemButton onClick={() => setSelectedGroup(group)}>
                            {`${group.displayName || "Group"} - ${group.id}`}
                        </ListItemButton>)}
                    </List>}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>Cancel</Button>
                {selectedGroup && <Button onClick={handleJoin}>Join</Button>}
            </DialogActions>
        </Dialog>
    </>
}

export default GroupJoin;