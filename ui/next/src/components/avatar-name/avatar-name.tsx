import { Avatar } from "@mui/material";
import { stringToColor } from "@/utils/string-to-color";

type AvatarNameProps = {
    username: string;
}

export function AvatarName({ username }: AvatarNameProps) {
    return (
        <div className="flex items-center">
            <Avatar sx={{
                bgcolor: stringToColor(username),
                color: stringToColor(username, { s: 60, l: 20 }),
                fontSize: "1.25em",
                width: "1.65em",
                height: "1.65em",
            }}>
                {username.at(0)}
            </Avatar>
            {username.substring(1)}
        </div>
    );
}
