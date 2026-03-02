import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatContent } from "./chat-content";
import { useAppSelector } from "@/store/store-hooks";

const sendMessageMock = jest.fn();

jest.mock("@/components/chat/useChatWS", () => ({
    useChatWS: () => ({ sendMessage: sendMessageMock }),
}));

const useAppSelectorMock = jest.fn();

jest.mock("@/store/store-hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("@/components/chat/chat-message", () => ({
    ChatMessage: ({ message, author, isMyMessage }: { message: string; author: string; isMyMessage: boolean }) => (
        <div data-testid="chat-message" data-author={author} data-is-my-message={String(isMyMessage)}>
            {message}
        </div>
    ),
}));

const mockUser = {
    username: "Test User",
    uuid: "user-1",
};

describe("ChatContent", () => {
    beforeEach(() => {
        sendMessageMock.mockClear();
        (useAppSelector as any).mockReturnValue(mockUser);
    });

    it("renders chat messages and marks own messages", () => {
        render(
            <ChatContent
                messages={[
                    { content: "Mine", senderName: "Test User", senderUuid: "user-1" },
                    { content: "Other", senderName: "Other User", senderUuid: "user-2" },
                ]}
            />
        );

        const messages = screen.getAllByTestId("chat-message");
        expect(messages).toHaveLength(2);
        expect(messages[0]).toHaveAttribute("data-is-my-message", "true");
        expect(messages[1]).toHaveAttribute("data-is-my-message", "false");
        expect(messages[0]).toHaveTextContent("Mine");
        expect(messages[1]).toHaveTextContent("Other");
    });

    it("sends message with user metadata and clears input", async () => {
        const user = userEvent.setup();
        render(<ChatContent messages={[]} />);

        const input = screen.getByLabelText("Message");
        await user.type(input, "Hello world");
        await user.click(screen.getByRole("button"));

        expect(sendMessageMock).toHaveBeenCalledTimes(1);
        expect(sendMessageMock).toHaveBeenCalledWith(
            JSON.stringify({
                content: "Hello world",
                senderName: "Test User",
                senderUuid: "user-1",
            })
        );
        expect(input).toHaveValue("");
    });

    it("does not send empty or whitespace-only messages", async () => {
        const user = userEvent.setup();
        render(<ChatContent messages={[]} />);

        const input = screen.getByLabelText("Message");

        await user.click(screen.getByRole("button"));
        expect(sendMessageMock).not.toHaveBeenCalled();

        await user.type(input, "   ");
        await user.click(screen.getByRole("button"));

        expect(sendMessageMock).not.toHaveBeenCalled();
    });
});
