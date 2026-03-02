import { Box, CardContent, Typography } from "@mui/material";
import { AvatarName } from "@/components/avatar-name/avatar-name";
import { stringToColor } from "@/utils/string-to-color";

type ChatMessageProps = {
    message: string;
    author: string;
    isMyMessage: boolean;
}

export function ChatMessage({ author, message, isMyMessage }: ChatMessageProps) {

    const userNameAlign = isMyMessage ? "right" : "left";

    return (
        <Box sx={{ borderColor: stringToColor(author) }} className="border-2 rounded-lg">
            <Typography
                component="div"
                gutterBottom
                data-testid="message-author"
                sx={{
                    color: "text.secondary",
                    backgroundColor: "white",
                    fontSize: 14,
                    justifySelf: userNameAlign,
                    padding: "0 5px",
                    margin: "0 10px",
                    translate: "0 -50%",
                    borderColor: "inherit",
                    borderLeftWidth: "inherit",
                    borderLeftStyle: "solid",
                    borderRightWidth: "inherit",
                    borderRightStyle: "solid",
                }}
            >
                <AvatarName username={author} />
            </Typography>
            <CardContent sx={{ paddingTop: 0, paddingBottom: "12px", ":last-child": { paddingBottom: "12px" } }}>
                <Typography variant="body2" component="span">
                    {message}
                </Typography>
            </CardContent>
        </Box>
    );
}
