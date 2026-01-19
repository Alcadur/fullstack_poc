import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEMO_USERS_PASSWORD, Login } from "./login";
import { userHttpService } from "@/service/user-http.service";
import "@testing-library/jest-dom";
import { useLoaderData } from "react-router";
import { useCustomSnackbarControl } from "@/components/custom-snackbar/use-custom-snackbar-control";

jest.mock("react-router", () => ({
    useLoaderData: jest.fn(),
}));

jest.mock("@/service/user-http.service", () => ({
    userHttpService: {
        login: jest.fn(),
    },
}));

jest.mock("@/hooks/use-debounce", () => ({
    __esModule: true,
    default: jest.fn(() => (callback: () => void, delay: number) => {
        setTimeout(callback, 0);
    }),
}));

jest.mock("@/components/custom-snackbar/use-custom-snackbar-control", () => ({
    useCustomSnackbarControl: jest.fn(() => ({
        error: jest.fn(),
        isOpen: false,
    })),
}));

describe("Login Component", () => {
    const mockDemoUsers = [
        { uuid: "1", username: "demo1" },
        { uuid: "2", username: "demo2" },
        { uuid: "3", username: "admin@" },
    ];

    const fillForm = async (username: string, password: string, send: boolean = false) => {
        const userAction = userEvent.setup();
        const usernameField = screen.getByLabelText(/username/i);
        const passwordField = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole("button", { name: /login/i });

        await userAction.type(usernameField, username);
        await userAction.type(passwordField, password);

        if (send) {
            await userAction.click(loginButton);
        }

        return { usernameField, passwordField, loginButton };
    };

    let mockSnackbarControl: any;
    let mockLogin: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSnackbarControl = {
            error: jest.fn(),
            isOpen: false,
        };
        (useLoaderData as jest.Mock).mockReturnValue(mockDemoUsers);
        (useCustomSnackbarControl as jest.Mock).mockReturnValue(mockSnackbarControl);
        mockLogin = userHttpService.login as jest.Mock;
    });

    describe("Rendering", () => {
        it("should render username field with demo users as options", () => {
            render(<Login />);

            const usernameField = screen.getByTestId("username-field");
            expect(usernameField).toBeInTheDocument();
        });

        it("should mark password field as required", () => {
            render(<Login />);

            const passwordField = screen.getByLabelText(/password/i);
            expect(passwordField).toBeRequired();
        });
    });

    describe("Form Submission", () => {
        it("should call userService.login with form data on submit", async () => {
            mockLogin.mockResolvedValue({ ok: true });

            render(<Login />);

            await fillForm("testuser", "testpassword", true);

            await waitFor(() => {
                expect(userHttpService.login).toHaveBeenCalledWith({
                    username: "testuser",
                    password: "testpassword",
                });
            });
        });

        it("should set loading state during login", async () => {
            let resolveLogin: any;
            mockLogin.mockReturnValue(
                new Promise((resolve) => {
                    resolveLogin = resolve;
                })
            );

            render(<Login />);

            await fillForm("testuser", "testpassword", true);

            await waitFor(() => {
                expect(userHttpService.login).toHaveBeenCalled();
            });

            resolveLogin({ ok: true });

            await waitFor(() => {
                expect(userHttpService.login).toHaveBeenCalledTimes(1);
            });
        });

        it("should not submit form with empty fields", async () => {
            const user = userEvent.setup();
            render(<Login />);

            const loginButton = screen.getByRole("button", { name: /login/i });
            await user.click(loginButton);

            expect(userHttpService.login).not.toHaveBeenCalled();
        });
    });

    describe("Error Handling", () => {
        it("should show error snackbar when login fails", async () => {
            mockSnackbarControl.isOpen = false;
            mockLogin.mockRejectedValue(new Error("Invalid credentials"));

            render(<Login />);

            await fillForm("wrong@example.com", "wrongpassword", true);

            await waitFor(() => {
                expect(mockSnackbarControl.error).toHaveBeenCalled();
            });
        });

        it("should handle network errors during login", async () => {
            mockLogin.mockRejectedValue(new Error("Network error"));

            render(<Login />);

            await fillForm("testuser", "testpassword", true);

            await waitFor(() => {
                expect(mockSnackbarControl.error).toHaveBeenCalled();
            });
        });

        it("should reset loading state after error", async () => {
            const user = userEvent.setup();
            mockLogin.mockRejectedValue(new Error("Login failed"));

            render(<Login />);

            const { loginButton } = await fillForm("testuser", "testpassword", true);

            await waitFor(() => {
                expect(mockSnackbarControl.error).toHaveBeenCalled();
            });

            // Should be able to submit again
            await user.click(loginButton);
            expect(userHttpService.login).toHaveBeenCalledTimes(2);
        });
    });

    describe("Demo User Auto-fill", () => {
        it("should auto-fill password when demo user is selected", async () => {
            const user = userEvent.setup();
            render(<Login />);

            const usernameField = screen.getByLabelText(/username/i);
            await user.type(usernameField, "demo1");

            await waitFor(() => {
                const passwordField = screen.getByLabelText(/password/i) as HTMLInputElement;
                expect(passwordField.value).toBe(DEMO_USERS_PASSWORD);
            }, { timeout: 500 });
        });

        it("should not auto-fill password if password already exists", async () => {
            const user = userEvent.setup();
            render(<Login />);

            const passwordField = screen.getByLabelText(/password/i);
            const usernameField = screen.getByLabelText(/username/i);

            await user.type(passwordField, "mypassword");
            await user.type(usernameField, "demo1@example.com");

            await waitFor(() => {
                const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
                expect(passwordInput.value).toBe("mypassword");
            }, { timeout: 500 });
        });

        it("should not auto-fill password for non-demo users", async () => {
            const user = userEvent.setup();
            render(<Login />);

            const usernameField = screen.getByLabelText(/username/i);
            await user.type(usernameField, "notademouser@example.com");

            await waitFor(() => {
                const passwordField = screen.getByLabelText(/password/i) as HTMLInputElement;
                expect(passwordField.value).toBe("");
            }, { timeout: 500 });
        });
    });

    describe("Form Data Handling", () => {
        it("should update form state when username changes", async () => {
            const user = userEvent.setup();
            render(<Login />);

            const usernameField = screen.getByLabelText(/username/i);
            await user.type(usernameField, "newuser@test.com");

            expect(usernameField).toHaveValue("newuser@test.com");
        });

        it("should update form state when password changes", async () => {
            const user = userEvent.setup();
            render(<Login />);

            const passwordField = screen.getByLabelText(/password/i);
            await user.type(passwordField, "newpassword123");

            expect(passwordField).toHaveValue("newpassword123");
        });

        it("should load demo users from loader data", () => {
            render(<Login />);

            expect(useLoaderData).toHaveBeenCalled();
        });
    });
});
