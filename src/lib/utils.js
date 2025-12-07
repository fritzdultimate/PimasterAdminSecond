import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size).join(' '));
    }
    return result;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function timeAgoOrInString(timeStr) {
    const date = new Date(timeStr);
    if (isNaN(date)) return 'Invalid date';

    const now = Date.now();
    const diff = Math.floor((date.getTime() - now) / 1000); // future is positive, past is negative
    const absDiff = Math.abs(diff);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 },
    ];

    for (const { label, seconds } of intervals) {
        const count = Math.floor(absDiff / seconds);
        if (count >= 1) {
            const timeStr = `${count} ${label}${count > 1 ? 's' : ''}`;
            return diff > 0 ? `in ${timeStr}` : `${timeStr} ago`;
        }
    }

    return 'just now';
}

export const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      return true;
    } catch {
      return false;
    }
  };


