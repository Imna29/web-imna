import type {$Fetch, NitroFetchRequest} from "nitropack";
import type { Socket } from "socket.io-client";


export const gptRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>, socket:Socket) => ({
    async basicChat(query: string) {
        socket.emit("basic-chat", {
            query
        });
    }
});