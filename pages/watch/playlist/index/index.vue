<script lang="ts" setup>
definePageMeta({
    layout: "watch-layout",
});

const watchStore = useWatchStore();

const { data: playlists, error } = await useAsyncData(
    "playlist",
    () => {
        return watchStore.watchRepo.getAllPlaylists();
    },
    {
        lazy: true,
    },
);
</script>

<template>
    <div class="mt-2">
        <h1 class="text-2xl">Playlists</h1>
        <div v-if="playlists" class="flex flex-wrap gap-8 mt-4">
            <div v-for="playlist in playlists" :key="playlist.id">
                <WatchPlaylistIcon :playlist="playlist" />
            </div>
        </div>
    </div>
</template>
