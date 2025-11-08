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

        // console.log('Connecting to WebSocket:', `${WS_URL}?token=${token.slice(0, 20)}...`);
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        
        ws.onopen = () => {
            // console.log('✅ WebSocket connected successfully');
            setLoading(false);
            setSocket(ws);
        };

        ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            console.error('WebSocket URL:', WS_URL);
            console.error('WebSocket readyState:', ws.readyState);
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
