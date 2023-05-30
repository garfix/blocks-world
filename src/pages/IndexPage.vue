<template>
    <q-page class="flex row">

        <div class="col column">
            <blocks-monitor></blocks-monitor>
        </div>
        <div class="col col-md-auto column">
            <blocks-chat ref="chat" @input="handleInput"></blocks-chat>
        </div>

    </q-page>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import BlocksChat from '../components/BlocksChat.vue'
import BlocksMonitor from '../components/BlocksMonitor.vue'
import controller from '../lib/controller'

const chat = ref()

onMounted(() => {
    controller.initialize('monitor', print)
})

function print(message) {
    chat.value.print(message)
}

function handleInput(input) {
    controller.handleInput(input)
}

</script>

<style scoped></style>
