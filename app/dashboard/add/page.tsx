"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LucideSave, LucideLoader2 } from "lucide-react";
import { addDevice } from "@/lib/actions";

export default function AddDevicePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError("");

        const result = await addDevice(formData);

        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.error || "Something went wrong");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Νέα Συσκευή</h1>
                <p className="text-slate-500">Καταχώρηση νέας συσκευής για επισκευή</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Όνομα Πελάτη</label>
                            <input name="customerName" required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Τηλέφωνο</label>
                            <input name="customerPhone" required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Μάρκα</label>
                            <input name="brand" required placeholder="p.x. Samsung" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Μοντέλο</label>
                            <input name="model" required placeholder="p.x. Galaxy S24" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Serial No</label>
                            <input name="serialNo" placeholder="Optional" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Περιγραφή Βλάβης</label>
                        <textarea name="description" required rows={4} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700" />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? <LucideLoader2 className="animate-spin" size={20} /> : <LucideSave size={20} />}
                            <span>Καταχώρηση</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
