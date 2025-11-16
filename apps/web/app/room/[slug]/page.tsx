import axios from "axios";
import { BACKEND_URL } from "../../cofig";
import { ChatRoom } from "../../components/ChatRoom";

async function getRoomId(slug: string): Promise<number | null> {
    try {
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
        const room = response.data?.room;
        return room?.id ?? null;
    } catch {
        return null;
    }
}

export default async function ChatRoomPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const roomId = await getRoomId(slug);
    if (!roomId) return <p>Room not found.</p>;
    return <ChatRoom id={String(roomId)} roomSlug={slug} />;
}
