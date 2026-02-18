"use client";

import { useState } from "react";
import { updateCompanyInfo } from "@/lib/actions";
import { LucideSave, LucideLoader2, LucideMessageSquare } from "lucide-react";

interface InfobipSettingsFormProps {
    initialData?: any;
}

export function InfobipSettingsForm({ initialData }: InfobipSettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setMessage("");

        // Preserve existing company info fields by adding them as hidden/merged if strictly needed by the server action
        // OR we update the server action to allow partial updates.
        // For now, let's assume the server action handles everything or we pass everything.
        // Actually, the server action `updateCompanyInfo` expects all fields.
        // To be safe and clean, we should probably have a dedicated action or ensure we send everything.
        // Let's rely on the fact that we can merge in the server action or just send these.
        // Wait, `updateCompanyInfo` currently expects name, phone, etc.
        // I will update `updateCompanyInfo` to be more flexible or create `updateInfobipSettings`.
        // Let's create a dedicated hidden input set or better: update the server action to be partial.
        // For this form, I'll send the fields.

        try {
            // We need to send existing company info too otherwise validation might fail if I don't change `updateCompanyInfo`
            // logic. Let's append them if they exist in initialData.
            if (initialData) {
                if (initialData.name) formData.append("name", initialData.name);
                if (initialData.phone) formData.append("phone", initialData.phone);
                // ... others
            }
            // Actually, this is brittle. I will update `updateCompanyInfo` to allow partial updates.

            const res = await updateCompanyInfo(formData);
            if (res.success) {
                setMessage("Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς!");
            } else {
                setMessage("Σφάλμα: " + res.error);
            }
        } catch (error) {
            setMessage("Σφάλμα σύνδεσης.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form action={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                    <LucideMessageSquare size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Ρυθμίσεις Infobip SMS</h2>
                    <p className="text-sm text-slate-500">Συνδέστε την υπηρεσία Infobip για αποστολή πραγματικών SMS.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        API Key
                    </label>
                    <input
                        type="password"
                        name="infobipApiKey"
                        defaultValue={initialData?.infobipApiKey || ""}
                        placeholder="Secret Key from Infobip Dashboard"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Base URL
                    </label>
                    <input
                        type="text"
                        name="infobipBaseUrl"
                        defaultValue={initialData?.infobipBaseUrl || ""}
                        placeholder="https://xxxxx.api.infobip.com"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Sender ID (Αποστολέας)
                    </label>
                    <input
                        type="text"
                        name="infobipSender"
                        defaultValue={initialData?.infobipSender || "Info"}
                        placeholder="Max 11 characters (e.g. MyShop)"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        maxLength={11}
                    />
                    <p className="text-xs text-slate-400 mt-1">Πρέπει να είναι εγκεκριμένο από την Infobip.</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.includes("Σφάλμα") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {message}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? <LucideLoader2 className="animate-spin" size={18} /> : <LucideSave size={18} />}
                    Αποθήκευση Ρυθμίσεων
                </button>
            </div>
        </form>
    );
}
