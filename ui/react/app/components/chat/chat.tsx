import { ChatOpenButton } from "@/components/chat/chat-open-button";
import styles from "./chat.module.css";
import { ChatContent } from "@/components/chat/chat-content";
import { Activity, useReducer, useState } from "react";
import { useChatWS } from "@/components/chat/useChatWS";
import type { ChatMessageModel } from "@/components/chat/chat.model";

const INIT_CHAT_MESSAGES_NUMBER = 5;

export function Chat() {
    const [chatOpenState, toggleChat] = useReducer(
        (prevState ) => prevState === "hidden" ? "visible" : "hidden",
        "hidden"
    );
    const [messages, setMessages] = useState<ChatMessageModel[]>([]);
    const [newMessages, setNewMessages] = useState(0);

    const handleChatToggle = () => {
        toggleChat();
        setNewMessages(0);
    }

    useChatWS({
        onMessage: (event) => {
            setMessages((prevMessages) => [JSON.parse(event.data), ...prevMessages,]);
            console.log(chatOpenState, messages.length)
            if (chatOpenState === "hidden" && messages.length > INIT_CHAT_MESSAGES_NUMBER) {
                setNewMessages(prev => prev + 1);
                console.log("asd")
            }
        }
    });

    return (
        <section className={styles.chatContainer}>
            <Activity mode={chatOpenState}>
                <ChatContent messages={messages}/>
            </Activity>
            <ChatOpenButton onClick={handleChatToggle} areNewMessages={newMessages > 0} />
        </section>
    )
}
