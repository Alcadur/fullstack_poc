import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/utils/consts";

const publicPaths = ['/'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!publicPaths.includes(pathname) && !pathname.includes("_next")) {
        const token = request.cookies.get(SESSION_COOKIE); // Check if the user has a valid token

        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    // Allow the request to continue if authenticated
    return NextResponse.next();
}
