import { useEffect, useState } from "react";
import { WS_URL } from "../cofig";


export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmZWViZmZlYS0zYTYyLTRmMmYtOWE4ZC0xNjJlZTkwZGM1NmIiLCJlbWFpbCI6InNodWJoIiwiaWF0IjoxNzYxMDM1NTE3fQ.6f3UROPUOeucz-BfuBgCkhIEuQP2fB0qHwUoBjG89K8`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}