import type {$Fetch, NitroFetchRequest} from "nitropack";
import type User from "~/models/apiModels/user/User";


export const authRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({
    async getUserSession(): Promise<any> {
        return fetch('/auth/session');
    },

    async registerUser(username: string, email: string, password: string) {
        return fetch<User>('/auth/register', {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password
            })
        });
    },
    registerWithUsername(username: string) {
        return fetch<User>('/auth/register/username', {
            method: "POST",
            body: JSON.stringify({
                username,
            })
        })
    }
});