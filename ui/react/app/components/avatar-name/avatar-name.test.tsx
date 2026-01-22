import { render, screen } from "@testing-library/react";
import { AvatarName } from "./avatar-name";

describe("AvatarName", () => {
    it("renders the avatar with the first letter of username", () => {
        render(<AvatarName username="User" />);
        expect(screen.getByText("U")).toBeInTheDocument();

        render(<AvatarName username="Bart" />);
        expect(screen.getByText("B")).toBeInTheDocument();

        render(<AvatarName username="Alice" />);
        expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("renders the remaining username text after the avatar", () => {
        render(<AvatarName username="User" />);
        expect(screen.getByText("ser")).toBeInTheDocument();

        render(<AvatarName username="Alice" />);
        expect(screen.getByText("lice")).toBeInTheDocument();

        render(<AvatarName username="Bart" />);
        expect(screen.getByText("art")).toBeInTheDocument();

    });

    it("displays the full username when combined", () => {
        const { container } = render(<AvatarName username="TestUser" />);

        expect(container?.textContent).toBe("TestUser");
    });

    it("applies stringToColor utility for background color", () => {
        const username = "Charlie";
        // Because of getComputedStyle return color as rgb expectedBgColor need to be "static" string
        const expectedBgColor = "rgb(150, 165, 13)";

        const { container } = render(<AvatarName username={username} />);
        const avatar = container.querySelector("[class*='MuiAvatar']") as HTMLElement;

        expect(avatar).toBeInTheDocument();
        expect(getComputedStyle(avatar).backgroundColor).toBe(expectedBgColor);
    });

    it("handles usernames with special characters", () => {
        render(<AvatarName username="@User#123" />);

        expect(screen.getByText("@")).toBeInTheDocument();
        expect(screen.getByText("User#123")).toBeInTheDocument();
    });

    it("preserves case sensitivity in username display", () => {
        render(<AvatarName username="MyAwesomeUsername" />);

        expect(screen.getByText("M")).toBeInTheDocument();
        expect(screen.getByText("yAwesomeUsername")).toBeInTheDocument();
    });

    it("renders empty substring when username has only one character", () => {
        const { container } = render(<AvatarName username="Z" />);

        expect(container?.textContent).toEqual("Z");
    });
});
