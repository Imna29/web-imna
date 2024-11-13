<script setup lang="ts">

const gptStore = useGptStore();
const query = ref<string>("");
const chatResponse = ref<any>();

async function askQuestion() {
    const response = gptStore.basicChat(query.value);
}
</script>

<template>
    <div class="">
        <h1 class="text-2xl">GPT</h1>
        <InputText placeholder="Enter your question here" class="mt-4" v-model="query" />
        <Button class="mt-4" @click="askQuestion">Ask</Button>
        {{ chatResponse }}
    </div>
</template>