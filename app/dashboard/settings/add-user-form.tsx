"use client";

import { createUser } from "@/lib/actions";
import { useRef } from "react";
import { LucideUserPlus } from "lucide-react";

export function AddUserForm() {
    const formRef = useRef<HTMLFormElement>(null);

    async function clientAction(formData: FormData) {
        const result = await createUser(formData);
        if (result.success) {
            alert("User created successfully!");
            formRef.current?.reset();
        } else {
            alert(result.error || "Failed to create user.");
        }
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <LucideUserPlus className="w-5 h-5 text-blue-600" />
                Προσθήκη Χρήστη (Add User)
            </h2>
            <form ref={formRef} action={clientAction} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                    <input name="username" type="text" required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                    <input name="password" type="password" required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <select name="role" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700">
                        <option value="TECHNICIAN">TECHNICIAN</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Add User
                </button>
            </form>
        </div>
    );
}
