import { Outlet, useNavigate } from "react-router";
import { useAppSelector } from "@/store/store-hooks";
import { userSelector } from "@/store/user-slice";
import { AvatarName } from "@/components/avatar-name/avatar-name";
import { Button } from "@mui/material";
import { userHttpService } from "@/service/user-http.service";
import { AppRoutes } from "@/routes/app-routes.model";
import { useRef } from "react";
import { NewTaskDialog } from "@/pages/tasks/components/new-task-dialog/new-task-dialog";


export default function TasksLayout() {
    const user = useAppSelector(userSelector)!;
    const navigate = useNavigate();
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleLogout = () => {
        navigate(AppRoutes.LOGIN);
        userHttpService.logout();
    };

    return (
        <section className="mx-auto md:max-w-250 min-w-75">
            <NewTaskDialog ref={dialogRef} />
            <header className="flex justify-center gap-3 p-3 shadow-[0_15px_10px_-15px_#111]">
                <AvatarName username={user.username} />
                <Button variant="contained" color="error" onClick={handleLogout} data-testid="logout-button">
                    Logout
                </Button>
            </header>
            <main className="flex flex-col items-center">
                <Button
                    variant="contained"
                    onClick={() => dialogRef.current?.showModal()}
                >
                    Add task
                </Button>
                <Outlet />
            </main>

        </section>
    );
}
