"use client";

import { useState } from "react";
import { LucideBuilding, LucideUsers, LucideShield, LucideUser, LucideMessageSquare, LucideTrash2, LucideKey } from "lucide-react";
import { CompanyInfoForm } from "./company-form";
import { AddUserForm } from "./add-user-form";
import { InfobipSettingsForm } from "./infobip-form";
import { PasswordModal } from "./password-modal";
import { deleteUser } from "@/lib/actions";

interface SettingsTabsProps {
    users: any[];
    companyInfo: any;
    role?: string;
    currentUserId?: string;
}

export function SettingsTabs({ users, companyInfo, role, currentUserId }: SettingsTabsProps) {
    const [activeTab, setActiveTab] = useState<"company" | "users" | "infobip">("company");
    const [selectedUser, setSelectedUser] = useState<{ id: string, username: string } | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        const res = await deleteUser(userId, currentUserId || "");
        if (!res.success) {
            alert(res.error || "Failed to delete user");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar / Tabs */}
            <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                <button
                    onClick={() => setActiveTab("company")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === "company"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    <LucideBuilding size={20} />
                    <span className="font-medium">Company Info</span>
                </button>

                {role === "ADMIN" && (
                    <button
                        onClick={() => setActiveTab("infobip")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === "infobip"
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        <LucideMessageSquare size={20} />
                        <span className="font-medium">Infobip SMS</span>
                    </button>
                )}

                <button
                    onClick={() => setActiveTab("users")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === "users"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    <LucideUsers size={20} />
                    <span className="font-medium">User Management</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
                {activeTab === "company" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <CompanyInfoForm initialData={companyInfo} />
                    </div>
                )}

                {activeTab === "infobip" && role === "ADMIN" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <InfobipSettingsForm initialData={companyInfo} />
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <AddUserForm />

                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Χρήστες Συστήματος (System Users)</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                                        <tr>
                                            <th className="p-4">Username</th>
                                            <th className="p-4">Role</th>
                                            <th className="p-4">Created At</th>
                                            {role === "ADMIN" && <th className="p-4 text-right">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {users?.map((user: any) => (
                                            <tr key={user.id}>
                                                <td className="p-4 font-medium text-slate-900 dark:text-white">{user.username}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {user.role === 'ADMIN' ? <LucideShield size={12} /> : <LucideUser size={12} />}
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                {role === "ADMIN" && (
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setIsPasswordModalOpen(true);
                                                                }}
                                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                                title="Change Password"
                                                            >
                                                                <LucideKey size={18} />
                                                            </button>

                                                            {user.id !== currentUserId && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    title="Delete User"
                                                                >
                                                                    <LucideTrash2 size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedUser && (
                <PasswordModal
                    isOpen={isPasswordModalOpen}
                    onClose={() => {
                        setIsPasswordModalOpen(false);
                        setSelectedUser(null);
                    }}
                    userId={selectedUser.id}
                    username={selectedUser.username}
                />
            )}
        </div>
    );
}
