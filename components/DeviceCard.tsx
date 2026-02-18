"use client";

import { useState } from "react";
import { LucideSmartphone, LucideUser, LucideCalendar, LucideArrowRight } from "lucide-react";
import { Modal } from "./Modal";
import { DeviceDetailsModal } from "./DeviceDetailsModal";

interface DeviceCardProps {
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

export function DeviceCard({ device, role }: DeviceCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const statusColors = {
        RECEIVED: "bg-blue-100 text-blue-800 border-blue-200",
        REPAIRING: "bg-orange-100 text-orange-800 border-orange-200",
        READY: "bg-green-100 text-green-800 border-green-200",
        DELIVERED: "bg-slate-100 text-slate-800 border-slate-200",
    };

    const statusLabels = {
        RECEIVED: "Παραλήφθηκε",
        REPAIRING: "Υπό Επισκευή",
        READY: "Έτοιμο",
        DELIVERED: "Παραδόθηκε",
    };

    const statusColor = statusColors[device.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200";
    const statusLabel = statusLabels[device.status as keyof typeof statusLabels] || device.status;

    return (
        <>
            <div className="group bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-700 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                            <LucideSmartphone className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{device.brand} {device.model}</h3>
                            <p className="text-xs text-slate-400 font-mono">#{device.id.slice(-6)}</p>
                            {/* Show Cost if Ready */}
                            {(device.status === 'READY' || device.status === 'DELIVERED') && device.repairCost && (
                                <p className="text-sm font-bold text-green-600 mt-1">
                                    {device.repairCost.toFixed(2)}€
                                </p>
                            )}
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                        {statusLabel}
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <LucideUser className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{device.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <LucideCalendar className="w-4 h-4 text-slate-400" />
                        <span>{new Date(device.updatedAt).toLocaleDateString("el-GR")}</span>
                    </div>
                </div>

                <div className="pt-2 mt-auto border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                    >
                        <span>Λεπτομέρειες</span>
                        <LucideArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Λεπτομέρειες Συσκευής"
            >
                <DeviceDetailsModal device={device} role={role} />
            </Modal>
        </>
    );
}
