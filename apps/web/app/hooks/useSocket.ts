import { useEffect, useState } from "react";
import { WS_URL } from "../cofig";

export function useSocket(token: string | null) {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const encodedToken = encodeURIComponent(token);
        const ws = new WebSocket(`${WS_URL}?token=${encodedToken}`);
        
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        };

        ws.onerror = () => {
            setLoading(false);
        };

        ws.onclose = () => {
            setLoading(false);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, [token]);

    return {
        socket,
        loading
    };
}
