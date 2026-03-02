import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chat } from "./chat";
import styles from "./chat.module.css";

let onMessageHandler: ((event: MessageEvent) => void) | undefined;

jest.mock("@/components/chat/useChatWS", () => ({
    useChatWS: (options: { onMessage?: (event: MessageEvent) => void } = {}) => {
        onMessageHandler = options.onMessage;
        return { sendMessage: jest.fn(), lastMessage: null, readyState: 1 };
    },
}));

jest.mock("@/components/chat/chat-content", () => ({
    ChatContent: ({ messages }: { messages: Array<{ content: string }> }) => (
        <div data-testid="chat-content">Messages: {messages.length}</div>
    ),
}));

const createMessageEvent = (content: string) =>
    new MessageEvent("message", {
        data: JSON.stringify({
            content,
            senderName: "Test User",
            senderUuid: "user-1",
        }),
    });

describe("Chat", () => {
    beforeEach(() => {
        onMessageHandler = undefined;
    });

    it("renders chat content and appends incoming messages", () => {
        render(<Chat />);

        expect(screen.getByTestId("chat-content")).toHaveTextContent("Messages: 0");
        expect(onMessageHandler).toBeDefined();

        act(() => {
            onMessageHandler?.(createMessageEvent("Hello"));
            onMessageHandler?.(createMessageEvent("World"));
        });

        expect(screen.getByTestId("chat-content")).toHaveTextContent("Messages: 2");
    });

    it("shows new message indicator after more than five messages while hidden", () => {
        render(<Chat />);

        for (let i = 1; i <= 7; i += 1) {
            act(() => {
                onMessageHandler?.(createMessageEvent(`Message ${i}`));
            });
        }

        const button = screen.getByRole("button");
        expect(button.className).toContain(styles.newMessage);
    });

    it("clears new message indicator after opening chat", async () => {
        const user = userEvent.setup();
        render(<Chat />);

        for (let i = 1; i <= 7; i += 1) {
            act(() => {
                onMessageHandler?.(createMessageEvent(`Message ${i}`));
            });
        }

        const button = screen.getByRole("button");
        expect(button.className).toContain("newMessage");

        await user.click(button);

        expect(button.className).not.toContain("newMessage");
    });
});
