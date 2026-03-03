
"use client";

import { logout } from "@/app/actions/auth";

export function Header({ user }: { user: any }) {
    return (
        <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex justify-between">
                <div className="flex-1 flex text-xl font-semibold text-gray-800 items-center">
                    {/* Breadcrumb-ish or Page Title could go here */}
                    Student Projects Management
                </div>
                <div className="ml-4 flex items-center md:ml-6 space-x-4">
                    <span className="text-sm text-gray-500">Welcome, <strong>{user?.username}</strong></span>
                    <button
                        type="button"
                        className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="sr-only">View notifications</span>
                        {/* Bell Icon */}
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <form action={logout}>
                        <button
                            type="submit"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
