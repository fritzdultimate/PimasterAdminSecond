import React, { useCallback, useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BotControlButton from '../BotControlButton';

const Sidebar = ( { sidebarOpen, nav, activeTab, setActiveTab, setSidebarOpen } ) => {
    const close = useCallback(() => setSidebarOpen?.(false), [setSidebarOpen]);
    const [isOnline, setIsOnline] = useState(false);
    const API = import.meta.env.VITE_API_URL;

    async function getBotStatus() {
        const res = await fetch(`${API}/main/bot/status`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            }
        });
        const json = await res.json();
        setIsOnline(json.success)
    }

    async function handleStartBot() {
        const res = await fetch(`${API}/main/bot/start`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            }
        });
        getBotStatus()
    }

    async function handleStopBot() {
        const res = await fetch(`${API}/main/bot/stop`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            }
        });
        getBotStatus()
    }

    useEffect(() => {
        getBotStatus();
        if (!sidebarOpen) return;
        const onKey = (e) => e.key === "Escape" && close();
        window.addEventListener("keydown", onKey);

        return () => window.removeEventListener("keydown", onKey);
    }, [sidebarOpen, close]);
    const NavButton = ({ k, label, Icon }) => (
        <Button
            variant={activeTab === k ? "secondary" : "ghost"}
            className={`justify-start w-full rounded-xl ${activeTab === k ? "bg-indigo-500/20 text-indigo-200" : "text-indigo-100 hover:bg-white/10"}`}
            onClick={() => {
                setActiveTab(k);
                setSidebarOpen(false);
            }}
        >
            <Icon className="mr-3 h-5 w-5" /> {label}
        </Button>
    );

    return (
        <>
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: sidebarOpen ? 0 : -280 }}
                transition={{ type: "spring", stiffness: 100, damping: 16 }}
                className="fixed left-0 top-[56px] z-30 h-[calc(100vh-56px)] w-72 overflow-y-auto border-r border-indigo-900/40 bg-gradient-to-b from-indigo-950 to-purple-950 p-4 md:static md:top-0 md:h-[calc(100vh-0px)] md:translate-x-0 md:w-64 md:border-r md:bg-transparent"
            >
                <nav className="space-y-2">
                    {nav.map((n) => (
                    <NavButton key={n.key} k={n.key} label={n.label} Icon={n.icon} />
                    ))}
                </nav>
                <div className="mt-6 rounded-xl border border-white/10 p-3 text-xs text-indigo-200/80 flex items-center w-full">
                    <div>
                        <p className="mb-1 font-medium">Bot Status</p>
                        <p  className="flex items-center gap-2">
                            <span className={`h-2 w-2 animate-pulse rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-gray-500'}`} /> 
                            {isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>

                    <BotControlButton onStart={handleStartBot} onStop={handleStopBot} isOnline={isOnline} />
                </div>
            </motion.aside>
        </>
    )
}

export default Sidebar