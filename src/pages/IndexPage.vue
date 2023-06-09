<template>
    <q-page class="flex row page-wrapper">

        <div class="col column">
            <blocks-monitor id="monitor"></blocks-monitor>
        </div>
        <div class="col col-md-auto column chat">
            <blocks-chat ref="chat" @input="handleInput"></blocks-chat>
        </div>
        <div class="col-md-auto col column sidebar q-gutter-md">
            <q-btn v-if="demoState == STATE_INACTIVE" color="primary" label="Start demo" class="sidebar-item"
                @click="startDemo" />
            <q-btn v-if="demoState == STATE_RUNNING" color="primary" label="Pause" class="sidebar-item"
                @click="pauseDemo" />
            <q-btn v-if="demoState == STATE_PAUSING" color="primary" label="Pausing ..." class="sidebar-item" disabled />
            <q-btn v-if="demoState == STATE_PAUSED" color="primary" label="Continue" class="sidebar-item"
                @click="continueDemo" />

            <q-linear-progress v-if="demoState" size="25px" :value="progress" class="sidebar-item" color="primary">
                <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="primary" :label="progressLabel" />
                </div>
            </q-linear-progress>
        </div>

    </q-page>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';
import BlocksChat from '../components/BlocksChat.vue'
import BlocksMonitor from '../components/BlocksMonitor.vue'
import controller from '../lib/controller'
import conversation from '../lib/conversation'

const BETWEEN_INTERACTIONS = 2000
const BETWEEN_KEY_STROKES = 100

const STATE_INACTIVE = "inactive"
const STATE_RUNNING = "running"
const STATE_PAUSING = "pausing"
const STATE_PAUSED = "paused"

const chat = ref()
const demoState = ref(STATE_INACTIVE)
const progress = computed(() => interactionIndex.value / conversation.length)
const progressLabel = computed(() => interactionIndex.value + " / " + conversation.length)
let interactionIndex = ref(0);

onMounted(() => {
    startController()
})

function startController() {
    controller.initialize('monitor', print, processlistClear, isAutomatic)
}

function startDemo() {
    demoState.value = STATE_RUNNING
    chat.value.clear()
    startController()
}

function isAutomatic() {
    return demoState.value == STATE_RUNNING || demoState.value == STATE_PAUSING
}

function print(message, isHtml) {
    return chat.value.print(message, isHtml)
}

function handleInput(input) {
    controller.handleInput(input)
}

function pauseDemo() {
    demoState.value = STATE_PAUSING
}

function continueDemo() {
    demoState.value = STATE_RUNNING
    nextInteraction()
}

function processlistClear() {
    if (demoState.value == STATE_PAUSING) {
        demoState.value = STATE_PAUSED
    }
    if (isAutomatic()) {
        if (demoState.value == STATE_RUNNING) {
            nextInteraction()
        }
    }
}

function nextInteraction() {
    const message = conversation[interactionIndex.value]
    interactionIndex.value++
    if (interactionIndex.value <= conversation.length) {
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
    interactionIndex.value = 0
    paused.value = false
    demoState.value = false
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

.sidebar-item {
    width: 150px;
}
</style>