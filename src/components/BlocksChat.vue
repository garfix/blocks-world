<template>
    <div class="col chat">
        <q-chat-message name="Me" :text="['hey, how are you?']" sent />
        <q-chat-message name="Blocks" :text="['doing fine, how r you?']" />
    </div>
    <div class="col col-md-auto">
        <q-input v-model="text" placeholder="Your command, question, or definition" />
    </div>
</template>

<script setup>

import { ref } from "vue"

const text = ref("")

</script>

<style scoped>
.chat {
    min-width: 800px;
    margin: 20px;
}
</style>
