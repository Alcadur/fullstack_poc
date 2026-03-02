import { render, screen } from "@testing-library/react";
import { ChatMessage } from "./chat-message";
import { stringToColor } from "@/utils/string-to-color";

describe("ChatMessage", () => {
    it("renders author and message", () => {
        const author = "Jane Doe";
        const message = "Hello from the chat";

        const { container } = render(
            <ChatMessage author={author} message={message} isMyMessage={false} />
        );

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(
            screen.getByTestId("message-author").textContent
        ).toBe(author);

        const wrapper = container.querySelector("div.border-2.rounded-lg");
        expect(wrapper).toHaveStyle({ borderColor: stringToColor(author) });
    });

    it("aligns author name to the right for my message", () => {
        const author = "Me";

        render(<ChatMessage author={author} message="Test" isMyMessage={true} />);

        const authorNode = screen.getByTestId("message-author");
        expect(authorNode).toHaveStyle({ justifySelf: "right" });
    });

    it("aligns author name to the left for other messages", () => {
        const author = "Other";

        render(<ChatMessage author={author} message="Test" isMyMessage={false} />);

        const authorNode = screen.getByTestId("message-author");
        expect(authorNode).toHaveStyle({ justifySelf: "left" });
    });
});
