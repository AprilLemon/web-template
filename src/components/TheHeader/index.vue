<script setup lang="ts">
</script>

<template>
  <MediaScreen>
    <template #pc>
      <TheHeaderPC :="$attrs" />
    </template>
    <template #mobile>
      <TheHeaderMobile />
    </template>
  </MediaScreen>
</template>

<style scoped lang="scss">
</style>
