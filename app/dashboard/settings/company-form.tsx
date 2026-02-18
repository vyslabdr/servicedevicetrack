"use client";

import { updateCompanyInfo } from "@/lib/actions";
import { LucideBuilding, LucideSave } from "lucide-react";
import { useRef } from "react";

interface CompanyInfoFormProps {
    initialData: {
        name?: string;
        phone?: string;
        address?: string | null;
        email?: string | null;
        website?: string | null;
    } | null;
}

export function CompanyInfoForm({ initialData }: CompanyInfoFormProps) {
    const formRef = useRef<HTMLFormElement>(null);

    async function clientAction(formData: FormData) {
        const result = await updateCompanyInfo(formData);
        if (result.success) {
            alert("Company info updated successfully!");
        } else {
            alert(result.error || "Failed to update info.");
        }
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <LucideBuilding className="w-5 h-5 text-blue-600" />
                Στοιχεία Εταιρείας (Company Info)
            </h2>
            <form ref={formRef} action={clientAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Επωνυμία (Business Name)
                    </label>
                    <input
                        name="name"
                        type="text"
                        defaultValue={initialData?.name || ""}
                        required
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                        placeholder="e.g. ServiceTrack Gr"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Τηλέφωνο (Phone)
                    </label>
                    <input
                        name="phone"
                        type="tel"
                        defaultValue={initialData?.phone || ""}
                        required
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                        placeholder="e.g. 2101234567"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Email
                    </label>
                    <input
                        name="email"
                        type="email"
                        defaultValue={initialData?.email || ""}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                        placeholder="info@example.com"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Διεύθυνση (Address)
                    </label>
                    <input
                        name="address"
                        type="text"
                        defaultValue={initialData?.address || ""}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                        placeholder="e.g. Ermou 12, Athens"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Website
                    </label>
                    <input
                        name="website"
                        type="url"
                        defaultValue={initialData?.website || ""}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="col-span-1 md:col-span-2 pt-2">
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors w-full sm:w-auto"
                    >
                        <LucideSave size={18} />
                        Αποθήκευση
                    </button>
                </div>
            </form>
        </div>
    );
}
