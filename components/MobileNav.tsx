"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideLayoutDashboard, LucidePlusCircle, LucideSettings } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export function MobileNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 md:hidden z-50">
            <div className="flex justify-around items-center h-16">
                <Link
                    href="/dashboard"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive("/dashboard")
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                >
                    <LucideLayoutDashboard size={20} />
                    <span className="text-xs font-medium">Πίνακας</span>
                </Link>
                <Link
                    href="/dashboard/add"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive("/dashboard/add")
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                >
                    <LucidePlusCircle size={20} />
                    <span className="text-xs font-medium">Νέα</span>
                </Link>
                <Link
                    href="/dashboard/settings"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive("/dashboard/settings")
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                >
                    <LucideSettings size={20} />
                    <span className="text-xs font-medium">Ρυθμίσεις</span>
                </Link>
                <div className="flex flex-col items-center justify-center w-full h-full space-y-1 text-red-500 hover:text-red-600 cursor-pointer">
                    <LogoutButton variant="mobile" />
                </div>
            </div>
        </div>
    );
}
