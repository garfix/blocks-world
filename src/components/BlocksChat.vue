<template>
    <div class="col chat">

        <div class="message-container" ref="container">
            <div v-for="message in messages">
                <q-chat-message v-if="message.sent" :name="message.from" :text="message.text" sent bg-color="grey-3" />
                <q-chat-message v-else :name="message.from" :text="message.text" :sent="message.sent" :avatar="avatar"
                    bg-color="red-2" />
            </div>
        </div>
    </div>
    <div class="col col-md-auto">

        <q-input bottom-slots v-model="text" label="Message" class="input" @keyup.enter="send" ref="input">
            <template v-slot:append>
                <q-icon v-if="text !== ''" name="close" class="cursor-pointer" @click="clear" />
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

defineExpose({
    print
})

const emits = defineEmits(['input'])
const props = defineProps(['inMessage'])
const container = ref()

const text = ref("")
const messages = ref([])
const input = ref()

function clear() {
    text.value = ''
}

onMounted(() => {
    input.value.focus()
})

function print(message) {
    if (message != "") {
        addMessage({
            from: "Blocks world",
            text: [message],
            sent: false
        })
    }
}

function send() {
    if (text.value !== "") {
        addMessage({
            from: "Me",
            text: [text.value],
            sent: true
        })
        emits('input', text.value)
        clear()
    }
}

function addMessage(message) {
    messages.value.push(message)
    nextTick(() => {
        container.value.scrollTop = container.value.scrollHeight
    });
}


</script>




<style scoped>
.bg-message-me {
    background-color: #a31f34 !important;
}

.bg-message-system {
    background-color: #a31f34 !important;
}

.message-container {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: auto;
    position: absolute;
    padding: 20px;
}

.chat {
    width: 50%;
    min-width: 400px;
    position: relative;
}

.input {
    margin: 10px;
}
</style>
