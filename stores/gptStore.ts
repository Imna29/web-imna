import { io } from "socket.io-client";
import { fetchEventSource } from '@microsoft/fetch-event-source';

export const useGptStore = defineStore('gptStore', () => {
    const { $apiClient } = useNuxtApp();
    const socket = io("localhost:3001");
    const gptRepo = gptRepository($apiClient, socket);

 

    socket.on("connect", () => {
        console.log("connected");
    });

    socket.on("basic-chat", (data) => {
        console.log(data);
    });

    async function basicChat(query: string) {
        await fetchEventSource('/api/gpt/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query:query
            }),
            onmessage(ev) {
                console.log(ev.data);
            }
        });
    }

    return {
        gptRepo,
        basicChat
    }
});