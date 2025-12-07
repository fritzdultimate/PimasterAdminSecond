import React from 'react'
import { Button } from "@/components/ui/button";
import { Bot, Menu, X, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const Header = ({ setSidebarOpen, sidebarOpen, setActiveTab }) => {
    const handleOverview = () => {
        setActiveTab('overview');
        setSidebarOpen(false);
    }
    return (
        <>
            {/* Header (mobile-first) */}
            <header className="sticky top-0 z-40 w-full border-b border-indigo-900/40 bg-black/60 backdrop-blur">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="md:hidden-tmp" onClick={() => setSidebarOpen((s) => !s)}>
                            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                        <div className="flex items-center gap-2">
                            <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }}>
                                <Bot className="h-6 w-6 text-indigo-400" />
                            </motion.span>
                            <span className="text-lg font-semibold tracking-tight">PiBot Admin</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-500" onClick={handleOverview}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Overview
                        </Button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header