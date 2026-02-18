import { LucideLayoutDashboard, LucidePlusCircle, LucideSettings } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { LogoutButton } from "@/components/LogoutButton";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Service<span className="text-blue-600">Track</span></h1>
                    <p className="text-xs text-slate-500 mt-1">Greek Device Manager</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                        <LucideLayoutDashboard size={20} />
                        <span className="font-medium">Πίνακας Ελέγχου</span>
                    </Link>
                    <Link href="/dashboard/add" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                        <LucidePlusCircle size={20} />
                        <span className="font-medium">Νέα Συσκευή</span>
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                        <LucideSettings size={20} />
                        <span className="font-medium">Ρυθμίσεις</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto pb-16 md:pb-0">
                <div className="container mx-auto p-6 md:p-10">
                    {children}
                </div>
            </main>
            <MobileNav />
        </div>
    );
}
