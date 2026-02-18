"use client";

import { signOut } from "next-auth/react";
import { LucideLogOut } from "lucide-react";

interface LogoutButtonProps {
    variant?: "default" | "mobile";
}

export function LogoutButton({ variant = "default" }: LogoutButtonProps) {
    if (variant === "mobile") {
        return (
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex flex-col items-center justify-center w-full h-full space-y-1"
            >
                <LucideLogOut size={20} />
                <span className="text-xs font-medium">Έξοδος</span>
            </button>
        );
    }

    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
            <LucideLogOut size={20} />
            <span className="font-medium">Έξοδος</span>
        </button>
    );
}
