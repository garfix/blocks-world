<template>
    <q-page class="flex row">

        <div class="col column">
            <blocks-monitor id="monitor"></blocks-monitor>
        </div>
        <div class="col col-md-auto column">
            <blocks-chat ref="chat" @input="handleInput"></blocks-chat>
        </div>
        <div class="col column">
            <q-btn color="primary" label="Start demo" @click="startDemo" />
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
    controller.initialize('monitor', print, () => { })
})

function print(message) {
    chat.value.print(message)
}

function handleInput(input) {
    controller.handleInput(input)
}

const interaction = [
    "Pick up a big red block",
    "Grasp the pyramid",
    "Find a block which is taller than the one you are holding and put it into the box."
]

let interactionIndex = 0;

function startDemo() {
    chat.value.clear()
    controller.initialize('monitor', print, nextInteraction)
}

function nextInteraction() {
    setTimeout(() => {
        const message = interaction[interactionIndex]
        interactionIndex++
        chat.value.enterInput(message)
    }, 1000)

}

</script>
