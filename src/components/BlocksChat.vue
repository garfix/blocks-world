<template>
    <div class="chat">

        <div class="message-container" ref="container">
            <div v-for="message in messages">
                <q-chat-message v-if="message.sent" :name="message.from" :text="message.text" sent bg-color="grey-3"
                    class="clickable" @click="selectAsInput(message.text)" title="Click to type again" />
                <q-chat-message v-else :name="message.from" :text="message.text" :text-html="message.isHtml"
                    :avatar="avatar" bg-color="red-2" />
            </div>
            <q-chat-message v-if="thinking" name="Blocks world" :avatar="avatar" bg-color="red-2">
                <q-spinner-dots v-if="thinking" size="2rem" />
            </q-chat-message>
        </div>
    </div>
    <div class="chat-input">

        <q-input bottom-slots v-model="text" label="Message" class="input" @keyup.enter="send" @keyup.up="previous"
            @keyup.down="next" ref="input" :disable="isAutomatic">
            <template v-slot:append>
                <q-icon v-if="text !== ''" name="close" class="cursor-pointer" @click="clearInput" />
            </template>

            <template v-slot:hint>
                Your command, question, or definition
            </template>

            <template v-slot:after>
                <q-btn v-if="text !== ''" round dense flat icon="send" @click="send" />
            </template>
        </q-input>

    </div>
</template>

<script setup>

import { ref, watch, nextTick, onMounted } from "vue"
import avatar from "../assets/avatar.png"
const thinking = ref(false)

defineExpose({
    print,
    typePartOfMessage,
    enterInput,
    enterInputAndFocus,
    clear
})

const emits = defineEmits(['input'])
const props = defineProps(['inMessage', 'isAutomatic'])
const container = ref()
const history = ref([""])
const historyIndex = ref(0)

const text = ref("")
const messages = ref([])
const input = ref()
const THINKING_TIME = 1000
const TYPING_TIME = 100

function clearInput() {
    text.value = ''
}

onMounted(() => {
    input.value.focus()
})

function clear() {
    messages.value = []
}

function typePartOfMessage(message) {
    text.value = message
    // if the text exceeds the visible area, auto scroll to the end
    input.value.$el.querySelector('input').scrollLeft = 1000
}

function enterInput(message) {
    text.value = message
    send()
}

function enterInputAndFocus(message) {
    text.value = message
    input.value.focus()
}

function print(message, isHtml) {
    const time = Math.min(TYPING_TIME * message.length, 7000)
    showBlocksWorldTyping(true)
    setTimeout(() => {
        showBlocksWorldTyping(false)
        addMessage({
            from: "Blocks world",
            text: [message],
            sent: false,
            isHtml: isHtml
        })
    }, time)
    return time
}

function send() {
    const input = text.value
    if (text.value !== "") {
        addMessage({
            from: "Me",
            text: [text.value],
            sent: true,
            isHtml: false
        })
        updateLastHistoryEntry()
        addToHistory("")
        clearInput()
        setTimeout(() => {
            emits('input', input)
        }, THINKING_TIME)

    }
}

function addToHistory(message) {
    history.value.push(message)
    historyIndex.value = history.value.length - 1
}

function updateLastHistoryEntry() {
    history.value[history.value.length - 1] = text.value
}

function previous() {
    // is this is last (current) entry?
    if (historyIndex.value === history.value.length - 1) {
        updateLastHistoryEntry()
    }

    if (historyIndex.value > 0) {
        historyIndex.value--
        text.value = history.value[historyIndex.value]
    }
}

function next() {
    if (historyIndex.value < history.value.length - 1) {
        historyIndex.value++
        text.value = history.value[historyIndex.value]
    }
}

function addMessage(message) {
    messages.value.push(message)
    scrollToBottom()
}

function showBlocksWorldTyping(active) {
    thinking.value = active
    if (active) {
        scrollToBottom()
    }
}

function scrollToBottom() {
    nextTick(() => {
        container.value.scrollTop = container.value.scrollHeight
    });
}

function selectAsInput(message) {
    text.value = message
    input.value.$el.focus()
}

</script>


<style scoped>
.chat {
    left: 0;
    right: 0;
    top: 0;
    bottom: 100px;
    position: absolute;
}

.chat-input {
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
}

.message-container {
    padding: 20px;
    /* https://stackoverflow.com/a/5048250 */
    position: absolute;
    bottom: 0px;
    right: 0px;
    left: 0px;
    overflow-y: auto;
    /* this is the key */
    max-height: 100%;
}


.input {
    margin: 10px;
}

.clickable {
    cursor: pointer;
}
</style>
