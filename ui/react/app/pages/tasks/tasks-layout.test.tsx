import { userHttpService } from "@/service/user-http.service";
import { useNavigate } from "react-router";
import { screen } from "@testing-library/react";
import { renderWithStore } from "@/utils/render-with-store";
import TasksLayout from "@/pages/tasks/tasks-layout";
import { AppRoutes } from "@/routes/app-routes.model";
import userEvent from "@testing-library/user-event";

jest.mock("@/service/user-http.service", () => ({
    userHttpService: {
        logout: jest.fn(),
    }
}));

jest.mock("react-router", () => ({
    useNavigate: jest.fn(),
    Outlet: jest.fn().mockImplementation(() => <div data-testid="outlet" />),
}));

describe("TasksLayout", () => {
    let mockNavigate: jest.Mock;
    let mockLogout: jest.Mock;

    const mockUser = Object.freeze({ username: "testuser" });

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogout = userHttpService.logout as jest.Mock;
        mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    it("should redirect to login and call logout on unmount (exactly in that order)", async () => {
        const userActions = userEvent.setup();
        renderWithStore(<TasksLayout />, { preloadedState: { userData: { user: mockUser as User } } });

        const logoutButton = screen.getByTestId("logout-button");
        await userActions.click(logoutButton);

        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(AppRoutes.LOGIN);
        try {
            expect(mockNavigate.mock.invocationCallOrder[0]).toBeLessThan(mockLogout.mock.invocationCallOrder[0]);
        } catch (e) {
            throw new Error("Logout should be called after redirecting to login");
        }
    });
});
