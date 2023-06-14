<template>
    <q-page class="flex row page-wrapper">

        <div class="col col-md-auto column monitor">
            <blocks-monitor id="monitor"></blocks-monitor>
        </div>
        <div class="col col-md-auto column chat">
            <blocks-chat ref="chat" @input="handleInput" :isAutomatic="isAutomatic()"></blocks-chat>
        </div>
        <div class="col col-md-auto column sidebar">
            <q-btn v-if="demoState == STATE_INACTIVE" color="primary" label="Start demo" class="sidebar-item"
                @click="startDemo" />
            <q-btn v-if="demoState == STATE_RUNNING" color="primary" label="Pause" class="sidebar-item"
                @click="pauseDemo" />
            <q-btn v-if="demoState == STATE_PAUSING" color="primary" label="Pausing ..." class="sidebar-item" disabled />
            <q-btn v-if="demoState == STATE_PAUSED" color="primary" label="Continue" class="sidebar-item"
                @click="continueDemo" />

            <q-linear-progress v-if="demoState != STATE_INACTIVE" size="25px" :value="progress" class="sidebar-item"
                color="primary">
                <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="primary" :label="progressLabel" />
                </div>
            </q-linear-progress>

            <q-btn v-if="voicePossible() && isInteractive() && !recording" push color="primary" round size="lg"
                icon="keyboard_voice" class="voice-input" @click="record()" />
            <q-btn v-if="recording" push color="primary" round size="lg" class="voice-input sidebar-item">
                <animated-sound-wave></animated-sound-wave>
            </q-btn>

            <q-select v-model="hint" :options="hints" label="Hints" @update:model-value="useHint" class="sidebar-item" />
        </div>

    </q-page>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';
import BlocksChat from '../components/BlocksChat.vue'
import BlocksMonitor from '../components/BlocksMonitor.vue'
import controller from '../lib/controller'
import conversation from '../lib/conversation'
import speech from '../lib/speech'
import AnimatedSoundWave from '../components/AnimatedSoundWave.vue'

const BETWEEN_INTERACTIONS = 2000
const BETWEEN_KEY_STROKES = 100

const STATE_INACTIVE = "inactive"
const STATE_RUNNING = "running"
const STATE_PAUSING = "pausing"
const STATE_PAUSED = "paused"

const CONFIDENCE_HIGH = 0.92

const chat = ref()
const demoState = ref(STATE_INACTIVE)
const progress = computed(() => interactionIndex.value / conversation.length)
const progressLabel = computed(() => interactionIndex.value + " / " + conversation.length)
const interactionIndex = ref(0);
const recording = ref(false)
const hints = ref([
    { value: "Pick up ", label: "Pick up <X>" },
    { value: "Stack up ", label: "Stack up <X>" },
    { value: "Put ", label: "Put <X> on <Y>" },
    { value: "What does the box contain?", label: "What does the box contain?" },
    { value: "What is ", label: "What is <X> supported by?" },
    { value: "How many ", label: "How many <X> are <Y>?" },
    { value: "Which  ", label: "Which <X> is sitting on <Y>?" },
    { value: "When did you ", label: "When did you <X>?" },
    { value: "Why did you ", label: "Why did you <X>?" },
    { value: "Is there ", label: "Is there <X>?" },
    { value: "I own ", label: "I own <X>" },
    { value: "Do I own ", label: "Do I own <X>?" },
    { value: "A ", label: "A <Name> is a <Description>" },
    { value: "Call ", label: "Call <X> \"<Name>\"" },
    { value: "Thank you", label: "Thank you" },



])
const hint = ref("")

onMounted(() => {
    startController()
    if (speech.isSupported()) {
        speech.init(handleSpeechInput)
    }
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

function isInteractive() {
    return !isAutomatic()
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
    demoState.value = STATE_INACTIVE
}

function voicePossible() {
    return speech.isSupported()
}

function record() {
    recording.value = true
    speech.start()
}

function handleSpeechInput(input, confidence) {
    recording.value = false
    if (confidence === 0) {
        return
    } else if (confidence > CONFIDENCE_HIGH) {
        chat.value.enterInput(input)
    } else {
        chat.value.enterInputAndFocus(input)
    }
}

function useHint(selected) {
    chat.value.enterInputAndFocus(selected.value)
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
    position: relative;
}

.monitor {
    position: absolute;
    left: 0;
    right: 50%;
    top: 0;
    bottom: 0;
    background-color: #c2c0bf;
}

.chat {
    position: absolute;
    left: 50%;
    right: 20%;
    top: 0;
    bottom: 0;
    background-color: white;
    padding: 10px;
}

.sidebar {
    position: absolute;
    left: 80%;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 20px;
}

@media (orientation: portrait) {
    .monitor {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 50%;
        background-color: #c2c0bf;
    }

    .chat {
        position: absolute;
        left: 0;
        right: 35%;
        top: 50%;
        bottom: 0;
        background-color: white;
        padding: 10px;
    }

    .sidebar {
        position: absolute;
        left: 65%;
        right: 0;
        top: 50%;
        bottom: 0;
        padding: 10px 10px 10px 10px;
    }

}

.sidebar-item {
    width: calc(100%);
    margin-bottom: 20px;
}

.voice-input {
    width: 60px;
    margin-left: auto;
    margin-right: auto;
}

.error {
    font-weight: bold;
    color: red;
}
</style>