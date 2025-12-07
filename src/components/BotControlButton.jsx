import { motion } from "framer-motion";
import { Loader2, Play, Square } from "lucide-react";
import { useState } from "react";

export default function BotControlButton({ isOnline, onStart, onStop }) {
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
        setLoading(true);
        try {
            if (isOnline) {
                await onStop();
            } else {
                await onStart();
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            disabled={loading}
            className={`
                ml-auto flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold shadow-md transition-all
                ${isOnline 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"}
                disabled:opacity-60 disabled:cursor-not-allowed
            `}

        >
        {loading ? (
            <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isOnline ? "Stopping..." : "Starting..."}
            </>
        ) : isOnline ? (
            <>
            <Square className="h-4 w-4" />
            Stop Bot
            </>
        ) : (
            <>
            <Play className="h-4 w-4" />
            Start Bot
            </>
        )}
        </motion.button>
    );
}
