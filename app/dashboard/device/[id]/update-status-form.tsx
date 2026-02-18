"use client";

import { updateDeviceStatus } from "@/lib/actions";
import { useState } from "react";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function UpdateStatusForm({ id, currentStatus }: { id: string, currentStatus: string }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showReadyModal, setShowReadyModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState("");
    const [cost, setCost] = useState("");
    const [notes, setNotes] = useState("");
    const router = useRouter();

    async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newStatus = e.target.value;
        if (newStatus === currentStatus) return;

        if (newStatus === "READY") {
            setPendingStatus(newStatus);
            setShowReadyModal(true);
            // Reset select until confirmed
            e.target.value = currentStatus;
            return;
        }

        if (!confirm("Are you sure you want to update the status? Notification will be sent.")) {
            e.target.value = currentStatus; // Reset selection
            return;
        }

        await executeUpdate(newStatus);
    }

    async function executeUpdate(status: string, repairCost?: number, repairNotes?: string) {
        setIsUpdating(true);
        console.log("Calling updateDeviceStatus for", id, status, repairCost, repairNotes);
        const result = await updateDeviceStatus(id, status, repairCost, repairNotes);
        console.log("Update result:", result);

        if (result.success) {
            router.refresh();
            setShowReadyModal(false);
        } else {
            alert("Failed to update status");
        }
        setIsUpdating(false);
    }

    function handleReadyConfirm() {
        const costValue = parseFloat(cost);
        if (isNaN(costValue)) {
            alert("Please enter a valid cost");
            return;
        }
        executeUpdate(pendingStatus, costValue, notes);
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                <select
                    disabled={isUpdating}
                    defaultValue={currentStatus}
                    onChange={handleStatusChange}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg p-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                    <option value="RECEIVED">Παραλήφθηκε (Received)</option>
                    <option value="REPAIRING">Υπό Επισκευή (Repairing)</option>
                    <option value="READY">Έτοιμο (Ready)</option>
                    <option value="DELIVERED">Παραδόθηκε (Delivered)</option>
                </select>
                {isUpdating && (
                    <div className="absolute right-3 top-3.5 text-blue-500">
                        <LucideLoader2 className="animate-spin" size={16} />
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-500">
                Η αλλαγή κατάστασης θα στείλει αυτόματα SMS στον πελάτη.
            </p>

            {/* Ready Modal (Cost & Notes) */}
            {showReadyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ολοκλήρωση Επισκευής</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Κόστος Επισκευής (€)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    className="w-full px-4 py-2 pl-8 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                    autoFocus
                                />
                                <span className="absolute left-3 top-2 text-slate-500">€</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Σημειώσεις Τεχνικού (Προαιρετικό)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                                placeholder="Περιγράψτε την επισκευή..."
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowReadyModal(false)}
                                className="flex-1 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Ακύρωση
                            </button>
                            <button
                                onClick={handleReadyConfirm}
                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                            >
                                Επιβεβαίωση
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
