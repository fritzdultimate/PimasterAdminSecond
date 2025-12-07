import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActionBtn({ onClick }) {
    const [loading, setLoading] = useState(false);
    const handleClick = async (e) => {
        e.preventDefault()
        setLoading(true);
        await onClick();
        setLoading(false);
    }
    return (
        <Button
            onClick={handleClick}
            disabled={loading}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
        >
            {loading ? (
                <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
                </>
            ) : (
                <>
                <PlusCircle className="h-4 w-4" />
                Upload
                </>
            )}
        </Button>
    );
}
