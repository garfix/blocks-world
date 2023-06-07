<template>
    <q-page class="flex row page-wrapper">

        <div class="col column">
            <blocks-monitor id="monitor"></blocks-monitor>
        </div>
        <div class="col col-md-auto column chat">
            <blocks-chat ref="chat" @input="handleInput"></blocks-chat>
        </div>
        <div class="col-md-auto col column sidebar">
            <q-btn v-if="!demoRunning" color="primary" label="Start demo" @click="startDemo" />
            <q-btn v-if="demoRunning && !paused" color="primary" label="Pause" @click="pauseDemo" />
            <q-btn v-if="demoRunning && paused" color="primary" label="Continue" @click="continueDemo" />
        </div>

    </q-page>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import BlocksChat from '../components/BlocksChat.vue'
import BlocksMonitor from '../components/BlocksMonitor.vue'
import controller from '../lib/controller'
import conversation from '../lib/conversation'

const chat = ref()
const demoRunning = ref(false)
const paused = ref(false)

onMounted(() => {
    controller.initialize('monitor', print, () => { }, false)
})

function print(message, isHtml) {
    return chat.value.print(message, isHtml)
}

function handleInput(input) {
    controller.handleInput(input)
}

const BETWEEN_INTERACTIONS = 2000
const BETWEEN_KEY_STROKES = 100

let interactionIndex = 0;

function startDemo() {
    demoRunning.value = true
    chat.value.clear()
    controller.initialize('monitor', print, nextInteraction, demoRunning)
}

function pauseDemo() {
    paused.value = true
}

function continueDemo() {
    paused.value = false
}

function nextInteraction() {
    if (paused.value) {
        setTimeout(() => {
            nextInteraction()
        }, 500)
        return
    }
    const message = conversation[interactionIndex]
    interactionIndex++
    if (interactionIndex <= conversation.length) {
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
    } else {
        resetDemo()
    }
}

function resetDemo() {
    interactionIndex = 0
    paused.value = false
    demoRunning.value = false
}

</script>
<style>
.q-page-container {
    background-color: #8a8b8c;
}

.page-wrapper {
    max-width: 1500px;
    margin-left: auto;
    margin-right: auto;
}

.chat {
    background-color: white;
}

.sidebar {
    padding: 20px;
}

.sidebar button {
    width: 150px;
}
</style>