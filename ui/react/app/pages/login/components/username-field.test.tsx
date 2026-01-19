import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UsernameField } from "./username-field";
import "@testing-library/jest-dom";

describe("UsernameField", () => {
    const mockOnChange = jest.fn();
    const mockOnBlur = jest.fn();
    const mockRef = jest.fn();
    const defaultOptions = ["user1@example.com", "user2@example.com", "admin@example.com"];

    const defaultProps = {
        name: "username",
        value: "",
        onChange: mockOnChange,
        onBlur: mockOnBlur,
        ref: mockRef,
        options: defaultOptions,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render the username field with correct label", () => {
            render(<UsernameField {...defaultProps} />);

            const textField = screen.getByLabelText(/username/i);
            expect(textField).toBeInTheDocument();
        });

        it("should render with required attribute", () => {
            render(<UsernameField {...defaultProps} />);

            const textField = screen.getByLabelText(/username/i);
            expect(textField).toBeRequired();
        });

        it("should render with correct className", () => {
            const { container } = render(<UsernameField {...defaultProps} />);

            const autocomplete = container.querySelector(".w-56");
            expect(autocomplete).toBeInTheDocument();
        });

        it("should render with initial value when provided", () => {
            render(<UsernameField {...defaultProps} value="initial@example.com" />);

            const textField = screen.getByLabelText(/username/i) as HTMLInputElement;
            expect(textField.value).toBe("initial@example.com");
        });
    });

    describe("User Interaction", () => {
        it("should call onChange when user types in the field", async () => {
            const user = userEvent.setup();
            render(<UsernameField {...defaultProps} />);

            const textField = screen.getByLabelText(/username/i);
            await user.type(textField, "test");

            expect(mockOnChange).toHaveBeenCalled();
        });

        it("should call onChange with correct value on input change", async () => {
            render(<UsernameField {...defaultProps} />);

            const textField = screen.getByLabelText(/username/i);
            fireEvent.change(textField, { target: { value: "newuser@example.com" } });

            await waitFor(() => {
                expect(mockOnChange).toHaveBeenCalledWith("newuser@example.com");
            });
        });

        it("should call onBlur when field loses focus", async () => {
            const user = userEvent.setup();
            render(<UsernameField {...defaultProps} />);

            const textField = screen.getByLabelText(/username/i);
            await user.click(textField);
            await user.tab();

            expect(mockOnBlur).toHaveBeenCalled();
        });
    });

    describe("Autocomplete Behavior", () => {
        it("should display autocomplete options when field is focused", async () => {
            const user = userEvent.setup();
            render(<UsernameField {...defaultProps} />);

            const textField = screen.getByLabelText(/username/i);
            await user.click(textField);

            await waitFor(() => {
                expect(screen.getByText("user1@example.com")).toBeInTheDocument();
                expect(screen.getByText("user2@example.com")).toBeInTheDocument();
                expect(screen.getByText("admin@example.com")).toBeInTheDocument();
            });
        });

        it("should filter options based on user input", async () => {
            const user = userEvent.setup();
            render(<UsernameField {...defaultProps} />);

            const textField = screen.getByLabelText(/username/i);
            await user.type(textField, "admin");

            await waitFor(() => {
                expect(screen.getByText("admin@example.com")).toBeInTheDocument();
            });
        });

        it("should call onChange when user selects an option from dropdown", async () => {
            const user = userEvent.setup();
            render(<UsernameField {...defaultProps} />);

            const textField = screen.getByLabelText(/username/i);
            await user.click(textField);

            await waitFor(() => {
                expect(screen.getByText("user1@example.com")).toBeInTheDocument();
            });

            await user.click(screen.getByText("user1@example.com"));

            expect(mockOnChange).toHaveBeenCalledWith("user1@example.com");
        });

        it("should support freeSolo mode allowing custom input not in options", async () => {
            const user = userEvent.setup();
            render(<UsernameField {...defaultProps} />);

            const textField = screen.getByLabelText(/username/i);
            await user.type(textField, "customuser@test.com");

            expect(mockOnChange).toHaveBeenCalled();
        });

        it("should handle empty options array", () => {
            render(<UsernameField {...defaultProps} options={[]} />);

            const textField = screen.getByLabelText(/username/i);
            expect(textField).toBeInTheDocument();
        });

        it("should update when options prop changes", () => {
            const { rerender } = render(<UsernameField {...defaultProps} />);

            const newOptions = ["newuser1@test.com", "newuser2@test.com"];
            rerender(<UsernameField {...defaultProps} options={newOptions} />);

            const textField = screen.getByLabelText(/username/i);
            expect(textField).toBeInTheDocument();
        });
    });

    describe("Field Props Integration", () => {
        it("should spread all field props to Autocomplete", () => {
            const customProps = {
                ...defaultProps,
                disabled: false,
                ref: jest.fn(),
            };

            render(<UsernameField {...customProps} />);

            const textField = screen.getByLabelText(/username/i);
            expect(textField).toBeInTheDocument();
        });

        it("should handle name prop correctly", () => {
            render(<UsernameField {...defaultProps} name="customName" />);

            const textField = screen.getByTestId('username-field');
            expect(textField).toHaveAttribute("name", "customName");
        });
    });
});
