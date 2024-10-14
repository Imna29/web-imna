<script setup lang="ts">
import type Genre from "~/models/apiModels/watch/Genre";

const watchStore = useWatchStore();

const props = defineProps<{
    genre?: Genre;
    sortBy: "popularity.desc" | "vote_average.desc";
}>();

const { data: moviesData, error } = await useAsyncData(
    `${props.genre?.id + props.sortBy}`,
    () => {
        return watchStore.watchRepo.discoverMovies(
            props.genre ? [props.genre.id] : [],
            props.sortBy,
            1,
        );
    },
    {
        lazy: true,
    },
);
</script>

<template>
    <div>
        <div class="text-3xl font-black">
            {{ sortBy === "popularity.desc" ? "Popular" : "Top Rated" }}
            {{ genre?.name }} Movies
        </div>
        <div class="mt-2">
            <swiper-container
                :slides-per-view="'auto'"
                :space-between="30"
                :navigation="true"
                virtua="true"
            >
                <swiper-slide
                    v-for="(slideContent, index) in moviesData?.results"
                    :key="index"
                    :virtualIndex="index"
                    class="md:!w-[15%] !w-1/2"
                >
                    <WatchMovieIcon :movie="slideContent"></WatchMovieIcon>
                </swiper-slide>
            </swiper-container>
        </div>
    </div>
</template>

<style scoped></style>
