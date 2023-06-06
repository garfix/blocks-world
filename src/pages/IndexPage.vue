<template>
    <q-page class="flex row">

        <div class="col column">
            <blocks-monitor id="monitor"></blocks-monitor>
        </div>
        <div class="col col-md-auto column">
            <blocks-chat ref="chat" @input="handleInput"></blocks-chat>
        </div>
        <div class="col column">
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

const interaction = [
    "Pick up a big red block",
    "Grasp the pyramid",
    "Find a block which is taller than the one you are holding and put it into the box.",
    "What does the box contain?",
    "What is the pyramid supported by?",
    "How many blocks are not in the box?",
    "Is at least one of them narrower than the one which I told you to pick up?",
    "Is it supported?",
    "Can the table pick up blocks?",
    "Can a pyramid be supported by a block?",
    "Can a pyramid support a pyramid?",
    "Stack up two pyramids.",
    "The blue pyramid is mine",
    "I own blocks which are not red, but I don't own anything which supports a pyramid",
    "Do I own the box?",
    "Do I own anything in the box?",
    "Will you please stack up both of the red blocks and either a green cube or a pyramid?",
    "Which cube is sitting on the table?",
    "Is there a large block behind a pyramid?",
    "Put a small one onto the green cube which supports a pyramid",
    "Put the littlest pyramid on top of it",
    "How many things are on top of green cubes?",
    "Had you touched any pyramid before you put the green one on the little cube?",
    "When did you pick it up?",
    "Why?",
    "Why did you do that?",
    "Why did you clear off that cube?",
    "Why did you do that?",
    "Why did you do that?",
    "How did you do it?",
    "How many objects did you touch while you were doing it?",
    "What did the red cube support before you started to clean it off?",
    "There were five blocks to the left of the box then.",
    "Put the blue pyramid on the block in the box.",
    "Is there anything which is bigger than every pyramid but is not as wide as the thing that supports it?",
    "Does a steeple",
    "A \"steeple\" is a stack which contains two green cubes and a pyramid.",
    "Are there any steeples now?",
    "Build one",
    "Call the biggest block \"superblock\".",
    "Have you picked up superblock since we began?",
    "Why did you drop it?",
    "Is there anything to the right of the red pyramid?",
    "Thank you",
]

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
    const message = interaction[interactionIndex]
    interactionIndex++
    if (interactionIndex <= interaction.length) {
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
