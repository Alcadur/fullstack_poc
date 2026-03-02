import { Fab } from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { cn } from "@/utils/cn";
import styles from "./chat.module.css";

type ChatOpenButtonProps = {
    onClick?: () => void;
    areNewMessages?: boolean;
}

export function ChatOpenButton({ onClick, areNewMessages }: ChatOpenButtonProps) {
    return (
        <Fab color="primary"
             className={cn({
                 [styles.newMessage]: areNewMessages
             })}
             onClick={onClick}
        >
            <ChatOutlinedIcon />
        </Fab>
    );
}
