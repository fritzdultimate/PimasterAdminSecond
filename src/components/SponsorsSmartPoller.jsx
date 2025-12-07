import { useEffect, useRef, useState } from "react";
import PassphraseTable from "./PassphraseTable";

export default function SponsorsSmartPoller({ onDelete }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const runningRef = useRef(true);
  const delayRef = useRef(5000); 
  const maxDelay = 60_000;

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    runningRef.current = true;

    const onVisibility = () => {
        if (document.hidden) {
            abortRef.current?.abort();
        } else {
            tick();
        }
    };

    document.addEventListener("visibilitychange", onVisibility);

    async function tick() {
        if (!runningRef.current || document.hidden) return;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

      try {
        const res = await fetch(`${API}/sponsors/list`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
            },
            body: JSON.stringify({ 
                name: 'whoami5677'

            }),
            signal: controller.signal 
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        console.log(json)
        setData(json);
        setError(null);
        delayRef.current = 5000;
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Request failed");
          // exponential backoff
          delayRef.current = Math.min(delayRef.current * 2, maxDelay);
        }
      } finally {
        if (runningRef.current) {
          // schedule next run
          window.setTimeout(tick, delayRef.current);
        }
      }
    }

    tick();

    return () => {
      runningRef.current = false;
      abortRef.current?.abort();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div>
      {error && <div className="text-red-500 text-sm">Error: {error}</div>}

        <div className="mt-4 overflow-x-auto">
            {
            data ? (
                <PassphraseTable onDelete={onDelete} data={data} table='Sponsors' />
            ) : (
                <p className="text-gray-500">No Sponsors yet...</p>
            )}
        </div>
    </div>
  );
}
