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

const usedMovieGenres = ref(new Set<number>());
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

const addCarouselItem = () => {
    const genre = getRandomUnusedMovieGenre.value;

    if (!genre) return;

    const sortOptions = ["vote_average.desc", "popularity.desc"];
    const randomSort =
        sortOptions[Math.floor(Math.random() * sortOptions.length)];

    carouselItems.value.push({
        id: Date.now(),
        genre,
        sortBy: randomSort,
    });

    usedMovieGenres.value.add(genre.id);
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
        <div v-for="item in carouselItems" :key="item.id">
            <WatchDiscoverMoviesCarousel
                :sortBy="item.sortBy"
                :genre="item.genre"
                class="mt-4"
            />
        </div>
    </div>
</template>

<style scoped></style>
