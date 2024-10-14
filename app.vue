<template>
    <div class="min-h-dvh">
        <LazyToast />
        <LazyDynamicDialog />
        <LazyConfirmDialog></LazyConfirmDialog>
        <LazyMiscLoadingIndicator></LazyMiscLoadingIndicator>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script lang="ts" setup>
import { register } from "swiper/element/bundle";

register();

const auth = useFirebaseAuth()!;
const router = useRouter();
const user = useCurrentUser();

watch(user, (user, prevUser) => {
    if (prevUser && !user) {
        // user logged out
        router.push("/");
    }
});

auth.onIdTokenChanged(async function (changedUser) {
    if (changedUser) {
        const idToken = await changedUser.getIdToken();
        const tokenCookie = useCookie("authorization");
        tokenCookie.value = idToken;
    } else {
        console.log("User is signed out");
    }
});
</script>
