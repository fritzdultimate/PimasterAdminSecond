// PasscodeGate.jsx
import { useState } from "react";

export default function PasscodeGate({ children }) {
  const alreadyAuthed =
    localStorage.getItem("site_ok") === "1" ||
    sessionStorage.getItem("site_ok") === "1";

  const [ok, setOk] = useState(alreadyAuthed);
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    const login = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer hfhryeujhshbxhdsjjskaas',
        },
        body: JSON.stringify({ 
            pass: code

        }),
    });
    const loginJson = await login.json();
    if (loginJson.success) {
      (remember ? localStorage : sessionStorage).setItem("site_ok", "1");
      setOk(true);
    } else {
      setError("Wrong passcode. Try again.");
    }
    setLoading(true)
  };

  if (ok) return children;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-slate-900 dark:via-slate-950 dark:to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10">
          <div className="p-8">
            <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              {/* lock icon */}
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <circle cx="12" cy="16" r="1.5" />
              </svg>
            </div>

            <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Enter Passcode
            </h1>
            <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
              This project is private. Please provide the access passcode.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="passcode"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Passcode
                </label>
                <div className="relative">
                  <input
                    id="passcode"
                    type={show ? "text" : "password"}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError("");
                    }}
                    autoFocus
                    aria-invalid={!!error}
                    aria-describedby={error ? "passcode-error" : undefined}
                    className={[
                      "w-full rounded-xl border bg-white/80 px-4 py-3 pr-12 text-slate-900 shadow-sm",
                      "placeholder:text-slate-400",
                      "focus:outline-none focus:ring-4 focus:ring-indigo-500/30",
                      "border-slate-200 dark:border-slate-700",
                      "dark:bg-slate-900/60 dark:text-slate-100",
                      error
                        ? "border-rose-400 focus:ring-rose-500/30"
                        : "border-slate-200",
                    ].join(" ")}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    aria-label={show ? "Hide passcode" : "Show passcode"}
                  >
                    {show ? (
                      // eye-off
                      <svg
                        viewBox="0 0 24 24"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                        <path d="M16.17 16.17C14.93 16.69 13.51 17 12 17c-5 0-9-5-9-5a16.7 16.7 0 0 1 3.23-3.23" />
                        <path d="M20.77 12.73A16.7 16.7 0 0 0 21 12s-4-5-9-5c-.83 0-1.63.12-2.39.33" />
                      </svg>
                    ) : (
                      // eye
                      <svg
                        viewBox="0 0 24 24"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M1 12s4 7 11 7 11-7 11-7-4-7-11-7S1 12 1 12Z" />
                        <circle cx="12" cy="12" r="3.5" />
                      </svg>
                    )}
                  </button>
                </div>

                {error && (
                  <p
                    id="passcode-error"
                    className="text-sm text-rose-600 dark:text-rose-400"
                  >
                    {error}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Remember on this device
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    // quick path to allow pasting & pressing Enter later
                    navigator.clipboard
                      .readText()
                      .then((txt) => setCode(txt || code))
                      .catch(() => {});
                  }}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Paste from clipboard
                </button>
              </div>

              <button
                type="submit"
                disabled={!code}
                className={[
                  "mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold",
                  "bg-indigo-600 text-white shadow-sm transition",
                  "enabled:hover:bg-indigo-700 enabled:active:scale-[.99]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30",
                ].join(" ")}
              >
                { loading ? 'Loading' : 'Continue'}
              </button>
            </form>
          </div>

          <div className="rounded-b-2xl border-t border-white/60 bg-white/70 px-8 py-4 text-center text-xs text-slate-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400">
            Protected area — authorized users only.
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/90">
                Pi Auto Claimer (PiMaster)
        </p>
      </div>
    </div>
  );
}
