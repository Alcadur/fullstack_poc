import useWebSocket from "react-use-websocket";

type UseChatWSProps = {
    onOpen?: () => void;
    onClose?: () => void;
    onMessage?: (event: MessageEvent) => void;
}

export function useChatWS({ onOpen, onClose, onMessage}: UseChatWSProps = {}) {
    const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:8080/ws", {
        share: true,
        shouldReconnect: () => true,
        reconnectInterval: 3000,
        onOpen: () => {
            onOpen?.();
        },
        onClose: () => {
            onClose?.();
        },
        onMessage: (event) => {
            onMessage?.(event);
        }
    });

    return { sendMessage, lastMessage, readyState };
}
