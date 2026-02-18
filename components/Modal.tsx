"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LucideX } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-[95%] md:w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all"
                role="dialog"
                aria-modal="true"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        {title || "Λεπτομέρειες"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <LucideX className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
