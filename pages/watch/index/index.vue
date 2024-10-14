<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useWindowScroll } from "@vueuse/core";

definePageMeta({
    layout: "watch-layout",
});

const watchStore = useWatchStore();

const { data: movieGenres, error: movieError } = await useAsyncData(() => {
    return watchStore.watchRepo.getMovieGenres();
});

const { data: tvGenres, error: tvError } = await useAsyncData(() => {
    return watchStore.watchRepo.getTvGenres();
});

const usedMovieGenres = ref(new Set<number>());
const usedTvGenres = ref(new Set<number>());
const carouselItems = ref<any[]>([]);
const { y } = useWindowScroll();

const getRandomUnusedGenre = (genres: any[], usedGenres: Set<number>) => {
    if (!genres) return null;
    const availableGenres = genres.filter((genre) => !usedGenres.has(genre.id));
    if (availableGenres.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableGenres.length);
    return availableGenres[randomIndex];
};

const getRandomUnusedMovieGenre = computed(() =>
    getRandomUnusedGenre(movieGenres.value!.genres, usedMovieGenres.value!),
);

const getRandomUnusedTvGenre = computed(() =>
    getRandomUnusedGenre(tvGenres.value!.genres, usedTvGenres.value!),
);

const addCarouselItem = () => {
    const isMovie = carouselItems.value.length % 2 === 0; // Alternate between movie and TV
    const genre = isMovie
        ? getRandomUnusedMovieGenre.value
        : getRandomUnusedTvGenre.value;

    if (!genre) return;

    const sortOptions = ["vote_average.desc", "popularity.desc"];
    const randomSort =
        sortOptions[Math.floor(Math.random() * sortOptions.length)];

    carouselItems.value.push({
        id: Date.now(),
        genre,
        sortBy: randomSort,
        isMovie,
    });

    if (isMovie) {
        usedMovieGenres.value.add(genre.id);
    } else {
        usedTvGenres.value.add(genre.id);
    }
};

// Initial population
for (let i = 0; i < 4; i++) {
    addCarouselItem();
}

function loadMoreItems() {
    for (let i = 0; i < 2; i++) {
        addCarouselItem();
    }
}

watch(y, () => {
    const bottomOfWindow =
        window.innerHeight + y.value >=
        document.documentElement.scrollHeight - 100;
    if (bottomOfWindow) {
        loadMoreItems();
    }
});
</script>

<template>
    <div class="mt-2">
        <WatchTrendingAll />
        <div v-for="item in carouselItems" :key="item.id">
            <WatchDiscoverMoviesCarousel
                v-if="item.isMovie"
                :sortBy="item.sortBy"
                :genre="item.genre"
                class="mt-4"
            />
            <WatchDiscoverTvCarousel
                v-else
                :sortBy="item.sortBy"
                :genre="item.genre"
                class="mt-4"
            />
        </div>
    </div>
</template>

<style scoped></style>
