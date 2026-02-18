import { getUsers, getCompanyInfo } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SettingsTabs } from "./settings-tabs";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return (
            <div className="p-8 text-center text-red-500">
                Unauthorized. Only Admins can access this page.
            </div>
        );
    }

    const { users } = await getUsers();
    const { info } = await getCompanyInfo();

    return (
        <div className="space-y-8 pb-20 md:pb-0">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Ρυθμίσεις (Settings)</h1>
            <SettingsTabs users={users || []} companyInfo={info || null} role={session.user.role} />
        </div>
    );
}
