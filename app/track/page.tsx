"use client";

import { useState } from "react";
import { LucideSearch, LucideLoader2, LucideCheckCircle, LucideClock, LucidePackage, LucideWrench } from "lucide-react";
import Link from "next/link";

export default function TrackPage() {
    const [ticketId, setTicketId] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [device, setDevice] = useState<any>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setDevice(null);

        try {
            const res = await fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId, phone }),
            });

            if (!res.ok) {
                if (res.status === 404) throw new Error("Δεν βρέθηκε συσκευή με αυτά τα στοιχεία.");
                throw new Error("Σφάλμα κατά την αναζήτηση.");
            }

            const data = await res.json();
            setDevice(data.device);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "RECEIVED": return <LucidePackage className="text-blue-500" size={48} />;
            case "REPAIRING": return <LucideWrench className="text-orange-500" size={48} />;
            case "READY": return <LucideCheckCircle className="text-green-500" size={48} />;
            case "DELIVERED": return <LucideCheckCircle className="text-slate-400" size={48} />;
            default: return <LucideClock className="text-slate-400" size={48} />;
        }
    };

    const getStatusText = (status: string) => {
        const statuses: any = {
            "RECEIVED": "Παραλήφθηκε",
            "REPAIRING": "Υπό Επισκευή",
            "READY": "Έτοιμο",
            "DELIVERED": "Παραδόθηκε",
        };
        return statuses[status] || status;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 bg-blue-600 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Service Tracker</h1>
                    <p className="text-blue-100 text-sm">Παρακολουθήστε την πορεία της επισκευής σας</p>
                </div>

                <div className="p-8">
                    {!device ? (
                        <form onSubmit={handleTrack} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Αριθμός Εντολής (τελευταία 6 ψηφία)
                                </label>
                                <input
                                    type="text"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value)}
                                    placeholder="π.χ. a1b2c3"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Τηλέφωνο
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="π.χ. 6900000000"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? <LucideLoader2 className="animate-spin" /> : <LucideSearch />}
                                Αναζήτηση
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="flex justify-center">
                                {getStatusIcon(device.status)}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                    {getStatusText(device.status)}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400">
                                    {device.brand} {device.model}
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-left space-y-3">
                                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <span className="text-slate-500 text-sm">Ημερομηνία Παραλαβής</span>
                                    <span className="font-medium text-slate-900 dark:text-white text-sm">
                                        {new Date(device.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <span className="text-slate-500 text-sm">Τελευταία Ενημέρωση</span>
                                    <span className="font-medium text-slate-900 dark:text-white text-sm">
                                        {new Date(device.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {device.repairCost && (
                                    <div className="flex justify-between pt-2">
                                        <span className="text-slate-500 text-sm">Κόστος</span>
                                        <span className="font-bold text-blue-600 text-lg">
                                            {device.repairCost}€
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setDevice(null)}
                                className="text-blue-600 text-sm font-medium hover:underline"
                            >
                                Αναζήτηση άλλης συσκευής
                            </button>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700">
                    <Link href="/login" className="hover:text-blue-500">Staff Login</Link>
                </div>
            </div>
        </div>
    );
}
