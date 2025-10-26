import axios from "axios";
import { BACKEND_URL } from "../../cofig";
import { ChatRoom } from "../../components/ChatRoom";

async function getRoomId(slug: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
        console.log(response.data);

        if (!response.data.room) {
            console.error(`Room not found for slug: ${slug}`);
            return null;
        }

        return response.data.room.id;
    } catch (err) {
        console.error("Failed to fetch room:", err);
        return null;
    }
}

export default async function ChatRoom1({
    params
}: {
    params: { slug: string }
}) {
    const slug = params.slug;
    const roomId = await getRoomId(slug);

    if (!roomId) {
        return <p>Room not found.</p>;
    }

    return <ChatRoom id={roomId} roomSlug={slug} />;
}
