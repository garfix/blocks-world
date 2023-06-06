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
const demoRunning = ref(false)

onMounted(() => {
    controller.initialize('monitor', print, () => { })
})

function print(message, isHtml) {
    chat.value.print(message, isHtml)
}

function handleInput(input) {
    controller.handleInput(input)
}

const interaction = [
    // "Pick up a big red block",
    // "Grasp the pyramid",
    // "Find a block which is taller than the one you are holding and put it into the box.",
    // "What does the box contain?",
    // "What is the pyramid supported by?",
    // "How many blocks are not in the box?",
    // "Is at least one of them narrower than the one which I told you to pick up?",
    // "Is it supported?"

    "How many things are on top of green cubes?"
]

const BETWEEN_INTERACTIONS = 2000
const BETWEEN_KEY_STROKES = 100

let interactionIndex = 0;

function startDemo() {
    demoRunning.value = true
    chat.value.clear()
    controller.initialize('monitor', print, nextInteraction, demoRunning)
}

function nextInteraction() {
    const message = interaction[interactionIndex]
    interactionIndex++
    setTimeout(() => {
        let i = 0
        const timer = setInterval(() => {
            if (i < message.length) {
                i++
                chat.value.typePartOfMessage(message.substring(0, i))
            } else {
                chat.value.enterInput(message)
                clearInterval(timer)
            }
        }, BETWEEN_KEY_STROKES)
    }, BETWEEN_INTERACTIONS)
}

</script>
