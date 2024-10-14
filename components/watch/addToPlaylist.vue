<script setup lang="ts">
import { Plus, Check, LoaderCircle } from "lucide-vue-next";

const watchStore = useWatchStore();
watchStore.getAllPlaylists();

const dialogRef: any = inject("dialogRef");
const props = ref<{
    contentId: number;
    contentType: "MOVIE" | "TV_SHOW"
} | null>(null);

const playlistId = ref<string>("");
const toast = useToast();

const { data, status, error, refresh, clear } = await useAsyncData(
    playlistId.value,
    () => {
        return watchStore.watchRepo.addToPlaylist(
            playlistId.value,
            props.value!.contentId,
            props.value!.contentType,
        );
    },
    {
        immediate: false,
    },
);

function addToPlaylist(playlistToAddId: string) {
    playlistId.value = playlistToAddId;
    refresh();
}

watch(status, (newStatus) => {
    if (newStatus === "success") {
        toast.add({
            severity: "success",
            summary: "Added to playlist",
            detail: `The ${props.value!.contentType === "MOVIE" ? "movie" : "show"
                } has been added to your playlist`,
            life: 3000
        });
    }
});

onMounted(() => {
    props.value = dialogRef.value.data;
})
</script>

<template>
    <div class="mt-2">
        <div class="mt-2">
            <div class="flex items-start flex-col gap-2">
                <div v-for="playlist in watchStore.playlists" :key="playlist.id">
                    <div class="flex flex-row items-center gap-4">
                        <div class="flex-grow-0" @click="addToPlaylist(playlist.id)">
                            <LoaderCircle v-if="
                                playlist.id === playlistId &&
                                status === 'pending'
                            " class="h-6 w-6 animate-spin" />
                            <Check v-else-if="
                                playlist.id === playlistId &&
                                status === 'success'
                            " class="h-6 w-6" />
                            <Plus v-else class="h-6 w-6" />
                        </div>
                        <div class="flex-grow flex-1">
                            <div class="text-lg font-bold">
                                {{ playlist.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
