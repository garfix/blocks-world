<template>
    <div :id="id" class="col monitor"></div>
</template>

<script setup>

defineProps(['id'])

</script>

<style scoped>
.monitor {
    background-color: #FFF5E9;
}
</style>