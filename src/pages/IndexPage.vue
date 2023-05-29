<template>
  <q-page class="flex row">

    <div class="col">
      .col
    </div>
    <div class="col chat">

      <q-chat-message
        name="me"
        :text="['hey, how are you?']"
        sent
      />
      <q-chat-message
        name="blocks"
        :text="['doing fine, how r you?']"
      />

    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>

<style scoped>

.chat {
  margin: 20px;
}
</style>
