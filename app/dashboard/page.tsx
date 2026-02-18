import { prisma } from "@/lib/db";
import { StatusCard } from "@/components/StatusCard";
import { DeviceCard } from "@/components/DeviceCard";
import { LucideBox, LucideWrench, LucideCheckCircle, LucideArchive } from "lucide-react";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; q?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    const { status: statusFilter, q: searchQuery } = await searchParams;

    // Fetch stats (using transaction for performance)
    const [received, repairing, ready, delivered] = await Promise.all([
        prisma.device.count({ where: { status: "RECEIVED" } }),
        prisma.device.count({ where: { status: "REPAIRING" } }),
        prisma.device.count({ where: { status: "READY" } }),
        prisma.device.count({ where: { status: "DELIVERED" } }),
    ]);

    // Build where clause
    const where: any = {};
    if (statusFilter) {
        where.status = statusFilter;
    }
    if (searchQuery) {
        where.OR = [
            { customerName: { contains: searchQuery } },
            { serialNo: { contains: searchQuery } },
        ];
    }

    // Fetch devices
    const devices = await prisma.device.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: 50,
    });

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/dashboard?status=RECEIVED">
                    <StatusCard
                        title="Παραλήφθηκε"
                        count={received}
                        color="bg-blue-500"
                        icon={LucideBox}
                        isActive={statusFilter === "RECEIVED"}
                    />
                </Link>
                <Link href="/dashboard?status=REPAIRING">
                    <StatusCard
                        title="Υπό Επισκευή"
                        count={repairing}
                        color="bg-orange-500"
                        icon={LucideWrench}
                        isActive={statusFilter === "REPAIRING"}
                    />
                </Link>
                <Link href="/dashboard?status=READY">
                    <StatusCard
                        title="Έτοιμο"
                        count={ready}
                        color="bg-green-500"
                        icon={LucideCheckCircle}
                        isActive={statusFilter === "READY"}
                    />
                </Link>
                <Link href="/dashboard?status=DELIVERED">
                    <StatusCard
                        title="Παραδόθηκε"
                        count={delivered}
                        color="bg-slate-600"
                        icon={LucideArchive}
                        isActive={statusFilter === "DELIVERED"}
                    />
                </Link>
            </div>



            {/* Device List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Λίστα Συσκευών</h2>
                    {statusFilter && (
                        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
                            Καθαρισμός Φίλτρων
                        </Link>
                    )}
                </div>

                {devices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {devices.map((device) => (
                            <DeviceCard key={device.id} device={device} role={role} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700">
                        <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                            <LucideBox className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Δεν βρέθηκαν συσκευές</h3>
                        <p className="text-slate-500 mt-1">Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης.</p>
                    </div>
                )}
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
