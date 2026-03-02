import { useAppSelector } from "@/store/store-hooks";
import { userSelector } from "@/store/user-slice";
import { useRef } from "react";
import { ChatMessage } from "@/components/chat/chat-message";
import type { ChatMessageModel } from "@/components/chat/chat.model";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useChatWS } from "@/components/chat/useChatWS";

type ChatContentProps = {
    messages: ChatMessageModel[]
}

export function ChatContent({ messages }: ChatContentProps) {
    const user = useAppSelector(userSelector)!;
    const messageInputRef = useRef<HTMLInputElement>(null);

    const { sendMessage } = useChatWS();

    const handleSendMessage = () => {
        if (!messageInputRef.current) {
            return;
        }

        const message = messageInputRef.current.value;

        if (message.trim() === "") {
            return;
        }

        sendMessage(JSON.stringify({
            content: message,
            senderName: user.username,
            senderUuid: user.uuid,
        }));

        messageInputRef.current.value = "";
    };

    const getIsMyMessage = (senderUuid: string) => user.uuid === senderUuid;

    return (
        <div className="flex flex-col overflow-hidden justify-end">
            <div className="flex flex-col-reverse gap-5 h-[calc(100vh-275px)] overflow-auto mb-2">
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message.content} author={message.senderName}
                                 isMyMessage={getIsMyMessage(message.senderUuid)} />
                ))}
            </div>
            <TextField
                id="standard-multiline-static"
                label="Message"
                multiline
                rows={2}
                variant="standard"
                inputRef={messageInputRef}
            />
            <Button onClick={handleSendMessage}><SendIcon color="secondary" sx={{ rotate: "-36deg" }} /></Button>
        </div>
    );
}
