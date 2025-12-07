import { useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { copyToClipboard, timeAgoOrInString } from "@/lib/utils";

export default function PassphraseTable({ data, table, onDelete }) {
  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // sorting
  const [sortKey, setSortKey] = useState("createdAt"); // "createdAt" | "claimableAt" | "status"
  const [sortDir, setSortDir] = useState("desc");      // "asc" | "desc"

  // filters
  const [statusFilter, setStatusFilter] = useState("__ALL__");
  const [search, setSearch] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const total = data.length;

  // unique statuses
  const statuses = useMemo(() => {
    const set = new Set();
    data.forEach(d => d.status && set.add(d.status));
    return Array.from(set).sort();
  }, [data]);

  const toTime = (v) => {
    if (!v) return 0;
    const t = new Date(v).getTime();
    return Number.isFinite(t) ? t : 0;
  };

  const filteredSorted = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    const filtered = data.filter((item) => {
      const statusOk = statusFilter === "__ALL__" || (item.status || "") === statusFilter;
      const searchOk = !searchLower || (item.mnemonic || "").toLowerCase().includes(searchLower) || (item.publicKey || "").toLowerCase().includes(searchLower);
      return statusOk && searchOk;
    });

    const sorted = filtered.sort((a, b) => {
      if (sortKey === "status") {
        const cmp = (a.status || "").localeCompare(b.status || "");
        return sortDir === "asc" ? cmp : -cmp;
      }
      const av = sortKey === "createdAt" ? toTime(a.createdAt) : toTime(a.claimableAt);
      const bv = sortKey === "createdAt" ? toTime(b.createdAt) : toTime(b.claimableAt);
      return sortDir === "asc" ? av - bv : bv - av;
    });

    return sorted;
  }, [data, sortKey, sortDir, statusFilter, search]);

  // pagination after filter/sort
  const filteredTotal = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, filteredTotal);
    const pageData = useMemo(() => filteredSorted.slice(start, end), [filteredSorted, start, end]);

    const go = (p) => setPage(Math.min(Math.max(1, p), totalPages));
    const toggleDir = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

    const handleCopy = async (row) => {
        const ok = await copyToClipboard(row.mnemonic || "");
        if (ok) {
            setCopiedId(row._id);
            setTimeout(() => setCopiedId(null), 1200);
        } else {
            alert("Failed to copy.");
        }
    };

    const handleDelete = async (row) => {
        const sure = window.confirm(
            "Are you sure you want to delete this passphrase? This action cannot be undone."
        );
        if (!sure) return;

        try {
        setDeletingId(row._id);
        if (typeof onDelete === "function") {
            await onDelete(row._id);
        }
        } catch (e) {
            alert("Delete failed.");
        } finally {
            setDeletingId(null);
        }
  };

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search mnemonic..."
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-gray-200"
        />
        {table !== 'Sponsors' && <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-gray-200"
        >
          <option value="__ALL__">All statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>}
      </div>

      {/* Sort controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className={`flex items-baseline gap-2 ${table !== 'Sponsors' ? '' : 'justify-center'}`}>
            {table !== 'Sponsors' && <div className="flex items-center gap-0.5">
                <span className="text-xs text-gray-400">Sort by: </span>
                <select
                    value={sortKey}
                    onChange={(e) => { setSortKey(e.target.value); setPage(1); }}
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs"
                >
                    <option value="createdAt">Created At</option>
                    <option value="claimableAt">Claimable At</option>
                    <option value="status">Status</option>
                </select>
            </div>}
            <div className="flex flex-col">
                <button
                    onClick={toggleDir}
                    className="px-2 py-1 text-xs rounded bg-sky-500 border border-sky-500/10 text-gray-50"
                    title="Toggle sort direction"
                >
                    {sortDir === "asc" ? "↑ Asc" : "↓ Desc"}
                </button>
                <span className="text-xs text-gray-400">
                    Filtered: <strong>{filteredTotal}</strong> / Total: <strong>{total}</strong>
                </span>
            </div>

          </div>

        {/* Page size */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="bg-gray-200 border border-white/10 rounded px-2 py-1 text-xs text-gray-900"
          >
            {[5, 10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="!text-gray-300">
              {table} ({filteredTotal})
            </TableHead>
            <TableHead className="text-right !text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageData.map((row) => (
            <TableRow key={row._id} className="hover:bg-white/5">
              <TableCell className="text-gray-400 font-semibold">
                {`${(row.mnemonic || "").slice(0, 15)}.....${(row.mnemonic || "").slice(-15)}`}
                <div className="mt-1 text-[10px] text-gray-300">
                  {table !== 'Sponsors' && <span>status: <span className={`${row.status === 'pending' ? 'text-amber-600' : row.status === 'claimed' ? 'text-green-600' : 'text-gray-600' }`}>{row.status || "—"}</span></span>}
                  {table !== 'Sponsors' && <span><br />Amount: <strong>{row.amount} PI</strong></span>}
                  {table === 'Sponsors' &&  <span>Created: {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}</span>}
                  {table === 'Sponsors' &&  <span>In Use: {row.inUse ? 'Yes' : "No"}</span>}
                  {table !== 'Sponsors' &&  <span><br />Owner: {row.owner ?? (row.name ? row.name : 'Main')}</span>}
                  {table !== 'Sponsors' && <span><br/>Claimable: {row.claimableAt ? `${new Date(row.claimableAt).toLocaleString()} (${timeAgoOrInString(row.claimableAt)})` : "—"}</span>}
                  {table === 'Sponsors' && <span><br/>PubKey: {`${(row.publicKey || "").slice(0, 15)}.....${(row.publicKey || "").slice(-15)}`}</span>}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => handleCopy(row)}
                        className={`rounded px-3 text-xs font-semibold transition ${
                        copiedId === row._id
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-300 text-gray-900"
                        }`}
                        title="Copy passphrase"
                    >
                        {copiedId === row._id ? "Copied!" : "Copy"}
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        disabled={deletingId === row._id}
                        className={`rounded px-3 text-xs py-1 font-semibold text-gray-200 transition ${
                        deletingId === row._id
                            ? "bg-red-400 opacity-70 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                        title="Delete passphrase"
                    >
                        {deletingId === row._id ? "Deleting…" : "Delete"}
                    </button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {pageData.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-sm text-gray-400 py-6">
                No records match your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-gray-400">
          Showing <strong>{filteredTotal === 0 ? 0 : start + 1}</strong>–<strong>{end}</strong> of <strong>{filteredTotal}</strong>
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => go(1)}
            disabled={page === 1}
            className="px-2 py-1 text-xs rounded bg-sky-500 border border-sky-500/10 text-gray-50 disabled:opacity-40"
          >
            « First
          </button>
          <button
            onClick={() => go(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 text-xs rounded bg-sky-500 border border-sky-500/10 text-gray-50 disabled:opacity-40"
          >
            ‹ Prev
          </button>
          <span className="text-xs text-gray-400 px-2">
            Page <strong>{page}</strong> / <strong>{Math.max(1, totalPages)}</strong>
          </span>
          <button
            onClick={() => go(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded bg-sky-500 border border-sky-500/10 text-gray-50 disabled:opacity-40"
          >
            Next ›
          </button>
          <button
            onClick={() => go(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded bg-sky-500 border border-sky-500/10 text-gray-50 disabled:opacity-40"
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
}
