<script setup lang="ts">
const watchStore = useWatchStore();


</script>

<template>
    <div class="md:mx-auto md:max-w-[1600px] md:px-1 px-2">
        <LazyWatchHeader></LazyWatchHeader>
        <div class="pb-2 relative">
            <div
                class="absolute w-full h-full top-0 left-0 z-50"
                v-show="watchStore.isSearching"
            >
                <WatchSearchResults></WatchSearchResults>
            </div>
            <div v-show="!watchStore.isSearching">
                <slot />
            </div>
        </div>
        
    </div>
</template>

<style scoped></style>
