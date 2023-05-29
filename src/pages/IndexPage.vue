<template>
  <q-page class="flex row">

    <div class="col column">
      <blocks-monitor></blocks-monitor>
    </div>
    <div class="col col-md-auto column">
      <blocks-chat></blocks-chat>
    </div>

  </q-page>
</template>

<script setup>

import { onMounted } from 'vue';
import BlocksChat from '../components/BlocksChat.vue'
import BlocksMonitor from '../components/BlocksMonitor.vue'
import controller from '../lib/controller'

onMounted(() => {
  controller.initialize('monitor')
})


</script>

<style scoped></style>
