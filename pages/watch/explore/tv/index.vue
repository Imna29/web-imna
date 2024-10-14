<script setup lang="ts">
import type Genre from "~/models/apiModels/watch/Genre";

definePageMeta({
    layout: "watch-layout",
});
const watchStore = useWatchStore();
const first = ref<number>(0);
const currentPage = computed(() => {
    return Math.floor(first.value / 20) + 1;
});

const { data: tvGenres, error: tvError } = await useAsyncData(() => {
    return watchStore.watchRepo.getTvGenres();
});
const selectedGenres = ref<Genre[]>([]);

const { data: exploreResults, error: exploreError } = await useAsyncData(
    () => {
        return watchStore.watchRepo.discoverTv(
            selectedGenres.value.map((el) => el.id),
            "popularity.desc",
            currentPage.value,
        );
    },
    {
        watch: [selectedGenres, currentPage],
    },
);

watch(selectedGenres, () => {
    first.value = 0;
});
</script>

<template>
    <div>
        <WatchGenreSelector :genres="tvGenres.genres" v-if="tvGenres" v-model="selectedGenres"></WatchGenreSelector>
        <Paginator :rows="20" :total-records="Math.min(500, exploreResults?.total_pages || 0) * 20"
            v-model:first="first" class="w-fit"
            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"></Paginator>
        <div class="flex flex-row flex-wrap gap-4 mt-2">
            <div v-for="result in exploreResults?.results" :key="result.id">
                <WatchTvIcon :tv-show="result"></WatchTvIcon>
            </div>
        </div>
        <Paginator :rows="20" :total-records="Math.min(500, exploreResults?.total_pages || 0) * 20"
            v-model:first="first" class="w-fit"
            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"></Paginator>
    </div>
</template>

<style scoped></style>
