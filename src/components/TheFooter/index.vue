<script setup lang="ts">

</script>

<template>
  <footer class="footer">
    我是页脚
  </footer>
</template>

<style scoped lang="scss">
  @media screen and (min-width: 781px) {
    @import "pc";
  }

  @media screen and (max-width: 780px) {
    @import "mobile";
  }
</style>
