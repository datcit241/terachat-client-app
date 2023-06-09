import {IconButton} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {GroupAdd, Info} from "@mui/icons-material";

export const ConversationInfo = (props) => {
    return <>
        <IconButton
            sx={{
                padding: 0,
                width: 44,
                height: 44,
            }}
        >
            <Info/>
        </IconButton>
    </>
}