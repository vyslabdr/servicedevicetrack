import { LucideIcon } from "lucide-react";

interface StatusCardProps {
    title: string;
    count: number;
    color: string; // e.g., "bg-blue-500"
    icon: LucideIcon;
    isActive: boolean;
}

export function StatusCard({ title, count, color, icon: Icon, isActive }: StatusCardProps) {
    return (
        <div
            className={`
        relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 border-2
        ${isActive ? `border-${color.split('-')[1]}-600 shadow-lg scale-105` : 'border-transparent shadow-sm hover:shadow-md'}
        bg-white dark:bg-slate-800
      `}
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${color} rounded-bl-full w-24 h-24`} />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{count}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color} text-white shadow-lg`}>
                    <Icon size={24} />
                </div>
            </div>

            {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
            )}
        </div>
    );
}
