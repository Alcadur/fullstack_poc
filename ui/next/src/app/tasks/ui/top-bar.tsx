"use client";

import { userHttpService } from "@/service/user-http.service";
import { redirect } from "next/dist/client/components/redirect";
import { useAppSelector } from "@/store/store-hooks";
import { userSelector } from "@/store/user-slice";
import { AvatarName } from "@/components/avatar-name/avatar-name";
import { Button } from "@mui/material";

export default function TopBar() {
    const user = useAppSelector(userSelector);

    if (!user) {
        redirect("/");
    }

    const handleLogout = async () => {
        userHttpService.logout();
        redirect("/");
    };

    return (
        <>
            <AvatarName username={user.username} />
            <Button variant="contained" color="error" onClick={handleLogout} data-testid="logout-button">
                Logout
            </Button>
        </>
    );
}
