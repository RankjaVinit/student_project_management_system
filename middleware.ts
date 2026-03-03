
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple mapping of role to path
const rolePaths = {
    ADMIN: "/admin",
    FACULTY: "/faculty",
    STUDENT: "/student",
};

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get("currentUser")?.value;
    const { pathname } = request.nextUrl;

    // 1. Redirect to login if accessing protected routes without user
    if (
        !currentUser &&
        (pathname.startsWith("/admin") ||
            pathname.startsWith("/faculty") ||
            pathname.startsWith("/student"))
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Redirect logged-in users away from login page
    if (currentUser && pathname === "/login") {
        const user = JSON.parse(currentUser);
        const targetPath = rolePaths[user.role as keyof typeof rolePaths] || "/";
        return NextResponse.redirect(new URL(targetPath + "/dashboard", request.url));
    }

    // 3. Role-based access control
    if (currentUser) {
        const user = JSON.parse(currentUser);

        if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/login", request.url)); // Or specific unauthorized page
        }
        if (pathname.startsWith("/faculty") && user.role !== "FACULTY") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (pathname.startsWith("/student") && user.role !== "STUDENT") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
