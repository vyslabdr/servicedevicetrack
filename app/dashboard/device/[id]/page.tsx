import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LucideArrowLeft, LucideCalendar, LucideUser, LucideSmartphone, LucideFileText } from "lucide-react";
import { UpdateStatusForm } from "./update-status-form";

export default async function DeviceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const device = await prisma.device.findUnique({
        where: { id },
    });

    if (!device) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
                <LucideArrowLeft size={16} className="mr-2" />
                Πίσω στον Πίνακα
            </Link>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Main Info */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {device.brand} {device.model}
                                </h1>
                                <p className="text-slate-500 font-mono text-sm mt-1">Serial: {device.serialNo || "N/A"}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-bold bg-${getStatusColor(device.status)}-100 text-${getStatusColor(device.status)}-800`}>
                                {getStatusLabel(device.status)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <LucideUser size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Πελάτης</label>
                                        <p className="font-medium text-slate-900 dark:text-white">{device.customerName}</p>
                                        <p className="text-slate-500">{device.customerPhone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <LucideSmartphone size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Συσκευή</label>
                                        <p className="font-medium text-slate-900 dark:text-white">{device.brand} {device.model}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <LucideCalendar size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Ημερομηνια</label>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {new Date(device.createdAt).toLocaleString('el-GR')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <LucideFileText size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Βλαβη</label>
                                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{device.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="w-full md:w-80 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Ενημέρωση Κατάστασης</h3>
                        <UpdateStatusForm id={device.id} currentStatus={device.status} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'RECEIVED': return 'blue';
        case 'REPAIRING': return 'orange';
        case 'READY': return 'green';
        case 'DELIVERED': return 'slate';
        default: return 'gray';
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case 'RECEIVED': return 'Παραλήφθηκε';
        case 'REPAIRING': return 'Υπό Επισκευή';
        case 'READY': return 'Έτοιμο';
        case 'DELIVERED': return 'Παραδόθηκε';
        default: return status;
    }
}
