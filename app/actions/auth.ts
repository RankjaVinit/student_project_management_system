
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";


export async function login(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // In a real app, you would hash the password and compare
    const user = await prisma.user.findFirst({
        where: {
            username,
            password_hash: password,
        },
    });

    if (!user) {
        return { error: "Invalid username or password" };
    }

    // Create a session (for demo purposes, storing user info in a cookie)
    // In production, use a secure session library (e.g., iron-session, next-auth)
    const sessionData = JSON.stringify({
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        ref_id: user.ref_id,
    });

    const cookieStore = await cookies();
    cookieStore.set("currentUser", sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
    });

    // Redirect based on role
    if (user.role === "ADMIN") {
        redirect("/admin/dashboard");
    } else if (user.role === "FACULTY") {
        redirect("/faculty/dashboard");
    } else if (user.role === "STUDENT") {
        redirect("/student/dashboard");
    } else {
        redirect("/");
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("currentUser");
    redirect("/login");
}
