<template>
    <div class="col chat">
        <q-chat-message v-for="message in messages" :name="message.from" :text="message.text" :sent="message.sent" />
        <!-- <q-chat-message name="Blocks" :text="['doing fine, how r you?']" /> -->
    </div>
    <div class="col col-md-auto">

        <q-input bottom-slots v-model="text" label="Message" class="input" @keyup.enter="send">
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

import { ref, watch } from "vue"

const emits = defineEmits(['input'])
const props = defineProps(['inMessage'])

const text = ref("")
const messages = ref([])

function clear() {
    text.value = ''
}

watch(() => props.inMessage, message => {
    if (message != "") {
        messages.value.push({
            from: "Blocks world",
            text: [message],
            sent: false
        })
    }
})

function send() {
    if (text.value !== "") {
        messages.value.push({
            from: "Me",
            text: [text.value],
            sent: true
        })
        emits('input', text.value)
        clear()
    }
}

</script>

<style scoped>
.chat {
    min-width: 600px;
    margin: 20px;
}

.input {
    margin: 5px;
}
</style>
