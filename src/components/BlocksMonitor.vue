<template>
    <div :id="id" class="monitor"></div>
</template>

<script setup>

defineProps(['id'])

</script>

<style scoped>
.monitor {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
}
</style>