"use client";

import { LucideCalendar, LucideUser, LucideSmartphone, LucideFileText, LucideWrench } from "lucide-react";
import { UpdateStatusForm } from "./UpdateStatusForm";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeviceDetailsModalProps {
    device: {
        id: string;
        serialNo: string | null;
        customerName: string;
        customerPhone: string;
        brand: string;
        model: string;
        status: string;
        updatedAt: Date;
        createdAt: Date;
        description: string;
        repairNotes: string | null;
        repairCost: number | null;
    };
    role?: string;
}

export function DeviceDetailsModal({ device, role }: DeviceDetailsModalProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη συσκευή;")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/devices/${device.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete device");

            router.refresh();
            // Close modal handled by parent but we invoke refresh which might trigger re-render
            window.location.reload(); // Simple reload to reflect changes and close modal
        } catch (error) {
            console.error(error);
            alert("Σφάλμα κατά τη διαγραφή");
            setIsDeleting(false);
        }
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RECEIVED': return 'blue';
            case 'REPAIRING': return 'orange';
            case 'READY': return 'green';
            case 'DELIVERED': return 'slate';
            default: return 'gray';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'RECEIVED': return 'Παραλήφθηκε';
            case 'REPAIRING': return 'Υπό Επισκευή';
            case 'READY': return 'Έτοιμο';
            case 'DELIVERED': return 'Παραδόθηκε';
            default: return status;
        }
    };

    const statusColor = getStatusColor(device.status);

    return (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        {device.brand} {device.model}
                    </h1>
                    <p className="text-slate-500 font-mono text-sm mt-1">Serial: {device.serialNo || "N/A"}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold bg-${statusColor}-100 text-${statusColor}-800`}>
                    {getStatusLabel(device.status)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Πελάτης & Συσκευή</h3>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <LucideUser size={18} className="text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500">Ονομα</label>
                                <p className="font-medium text-slate-900 dark:text-white">{device.customerName}</p>
                                <p className="text-sm text-slate-500">{device.customerPhone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <LucideSmartphone size={18} className="text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500">Μοντέλο</label>
                                <p className="font-medium text-slate-900 dark:text-white">{device.brand} {device.model}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dates & Issue */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Λεπτομέρειες</h3>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <LucideCalendar size={18} className="text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500">Ημ. Παραλαβής</label>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {new Date(device.createdAt).toLocaleDateString('el-GR')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <LucideFileText size={18} className="text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500">Περιγραφή Βλάβης</label>
                                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{device.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status Update & Actions */}
                <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Ενημέρωση Κατάστασης</h3>
                        <UpdateStatusForm id={device.id} currentStatus={device.status} />
                    </div>

                    {/* Repair Notes - Conditional Display for READY status */}
                    {device.status === 'READY' && device.repairNotes && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                                    <LucideWrench size={18} className="text-green-700 dark:text-green-300" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-green-700 dark:text-green-300 uppercase">Σημειώσεις Επισκευής</label>
                                    <p className="text-sm text-green-800 dark:text-green-100 mt-1 whitespace-pre-wrap">
                                        {device.repairNotes}
                                    </p>
                                    {device.repairCost && (
                                        <p className="text-lg font-bold text-green-700 dark:text-green-300 mt-2">
                                            Κόστος: {device.repairCost.toFixed(2)}€
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin Actions */}
                    {role === 'ADMIN' && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                                {isDeleting ? "Διαγραφή..." : "Διαγραφή Συσκευής"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
