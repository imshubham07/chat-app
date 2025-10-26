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

        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setLoading(false);
        };

        return () => {
            ws.close();
        };
    }, [token]);

    return {
        socket,
        loading
    };
}
