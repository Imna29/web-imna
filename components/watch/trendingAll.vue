<script setup lang="ts">
const watchStore = useWatchStore();
const activeIndex = ref<number>(0);
import WatchAddToPlaylist from "~/components/watch/addToPlaylist.vue";

const { data, error } = await useLazyAsyncData(() => {
    return watchStore.watchRepo.getTrendingAll("week");
});

function onActiveIndexChange(e: any) {
    const [swiper] = e.detail;
    activeIndex.value = swiper.activeIndex;
}

const dialog = useDialog();

function openDialog(id: number, contentType: "MOVIE" | "TV_SHOW") {
    dialog.open(WatchAddToPlaylist, {
        props: {
            header: "Add to Playlist",
        },
        data: {
            contentId: id,
            contentType: contentType,
        },
    });
}



</script>

<template>
    <div>
        <swiper-container :slides-per-view="1" :centered-slides="true" :effect="'coverflow'" :navigation="{
            enabled: true,
        }" :breakpoints="{
                768: {
                    slidesPerView: 2,
                },
            }" @swiperactiveindexchange="onActiveIndexChange">
            <swiper-slide v-for="(item, index) in data?.results" :key="item.id" class="">
                <div class="relative" v-if="item.media_type === 'movie'">
                    <img :src="'https://image.tmdb.org/t/p/w1280' +
                        item.backdrop_path
                        " class="max-h-[30rem] w-full object-cover rounded-xl" />
                    <div
                        class="absolute top-0 left-0 w-full h-full p-4 bg-black bg-opacity-30 flex flex-col items-center text-center">
                        <div class="flex-grow"></div>
                        <h2
                            class="text-white text-2xl md:text-3xl lg:text-4xl font-bold overflow-hidden whitespace-nowrap overflow-ellipsis">
                            {{ item.title }}
                        </h2>
                        <div class="mt-2 flex space-x-4" v-show="index == activeIndex">
                            <NuxtLink :to="'/watch/movie/' + item.id">
                                <Button class="text-xl p-6">Watch</Button>
                            </NuxtLink>
                            <Button class="text-xl p-6 " severity="secondary" @click="openDialog(item.id, 'MOVIE')">Add to
                                List</Button>
                        </div>
                    </div>
                </div>
                <div class="relative" v-else>
                    <img :src="'https://image.tmdb.org/t/p/w1280' +
                        item.backdrop_path
                        " class="max-h-[30rem] w-full object-cover rounded-xl" />
                    <div
                        class="absolute top-0 left-0 w-full h-full p-4 bg-black bg-opacity-30 flex flex-col items-center text-center">
                        <div class="flex-grow"></div>
                        <h2
                            class="text-white text-2xl md:text-3xl lg:text-4xl font-bold overflow-hidden whitespace-nowrap overflow-ellipsis">
                            {{ item.name }}
                        </h2>
                        <div class="mt-2 flex space-x-4" v-show="index == activeIndex">
                            <NuxtLink :to="'/watch/tv/' + item.id">
                                <Button class="text-xl p-6">Watch</Button>
                            </NuxtLink>
                            <Button class="text-xl p-6" severity="secondary"@click="openDialog(item.id, 'TV_SHOW')">Add to
                                List</Button>
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper-container>
    </div>
</template>

<style scoped></style>
