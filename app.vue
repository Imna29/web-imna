<template>
    <div class="min-h-dvh">
        <Toast />
        <DynamicDialog />
        <ConfirmDialog></ConfirmDialog>
        <MiscLoadingIndicator></MiscLoadingIndicator>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script lang="ts" setup>
let swiperInitialized = false;
const initializeSwiper = async () => {
  if (!swiperInitialized) {
    const { register } = await import("swiper/element/bundle");
    register();
    swiperInitialized = true;
  }
};

onBeforeMount(() => {
  initializeSwiper();
});

const auth = useFirebaseAuth();
const router = useRouter();
const user = useCurrentUser();

watch(user, (user, prevUser) => {
    if (prevUser && !user) {
        // user logged out
        router.push("/");
    }
});

auth?.onIdTokenChanged(async function (changedUser) {
    if (changedUser) {
        const idToken = await changedUser.getIdToken();
        const tokenCookie = useCookie("authorization");
        tokenCookie.value = idToken;
    } else {
        console.log("User is signed out");
    }
});
</script>
