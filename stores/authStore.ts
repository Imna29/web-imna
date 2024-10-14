export const useAuthStore = defineStore('authStore', () => {
    const {$apiClient} = useNuxtApp();
    const authRepo = authRepository($apiClient);

    async function getUserSession() {
        return authRepo.getUserSession();
    }

    async function registerUser(username: string, email: string, password: string) {
        return authRepo.registerUser(username, email, password);
    }

    async function registerWithUsername(username:string){
        return authRepo.registerWithUsername(username);
    }

    return {
        getUserSession,
        registerUser,
        registerWithUsername
    }
});