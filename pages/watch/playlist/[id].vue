<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
definePageMeta({
    title: "Playlist",
    layout: "watch-layout",
});

const confirm = useConfirm();
const toast = useToast();

const watchStore = useWatchStore();
const id: string = useRoute().params.id.toString();

const {
    data: playlist,
    status,
    refresh,
} = useAsyncData(
    `playlist${id}`,
    () => {
        return watchStore.watchRepo.getPlaylistItems(id);
    },
    {
        lazy: true,
    },
);

// Reactive Set to store selected item IDs
const selectedItems = reactive(new Set<string>());

const toggleSelection = (itemId: string) => {
    if (selectedItems.has(itemId)) {
        selectedItems.delete(itemId);
    } else {
        selectedItems.add(itemId);
    }
};


function onDeleteItems() {
    confirm.require({
        message: "Are you sure you want to delete the selected items?",
        header: "Delete Items",
        icon: 'pi pi-exclamation-triangle',
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary'
        },
        accept: async () => {
            await deleteSelectedItems();
        },
    });
}

const deleteSelectedItems = async () => {
    if (!playlist.value) return;

    await watchStore.watchRepo.deleteFromPlaylist(
        id,
        Array.from(selectedItems),
    );

    await refresh();
    toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Items deleted successfully', life: 3000 });
    selectedItems.clear();
}
</script>

<template>
    <div v-if="playlist">
        <div class="text-3xl mt-2">{{ playlist.name }}</div>

        <div v-if="selectedItems.size > 0" class="mt-4">
            <Button @click="onDeleteItems" class="font-bold">
                <Trash2 class="w-5 h-5 mr-2" />
                Delete From Playlist
            </Button>
        </div>

        <div class="mt-4 flex flex-wrap gap-4">
            <div v-for="playlistItem in playlist.items" :key="playlistItem.id" @click="toggleSelection(playlistItem.id)"
                :class="{
                    'border-2': selectedItems.has(playlistItem.id),
                    'rounded-lg': selectedItems.has(playlistItem.id),
                    'border-blue-500': selectedItems.has(playlistItem.id),
                }" class="cursor-pointer">
                <WatchMovieIcon class="md:w-[200px] w-[150px]" :movie-id="playlistItem.contentId"
                    v-if="playlistItem.contentType === 'MOVIE'"></WatchMovieIcon>
                <WatchTvIcon class="md:w-[200px] w-[150px]" :tv-id="playlistItem.contentId" v-else></WatchTvIcon>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
}

.btn-danger {
    background-color: #e3342f;
    color: white;
}

.btn-danger:hover {
    background-color: #cc1f1a;
}
</style>
