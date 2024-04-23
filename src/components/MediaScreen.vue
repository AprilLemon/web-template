<script setup lang="ts">
  // function IsPC () {
  //   const info = navigator.userAgent
  //   const isPhone = /mobile/i.test(info)
  //   console.log(info)
  //   console.log(isPhone)
  //   return isPhone
  // }
</script>

<template>
  <div class="pc">
    <slot name="pc" />
  </div>
  <div class="mobile">
    <slot name="mobile" />
  </div>
</template>

<style scoped lang="scss">
  .pc {
    display: block;
  }

  .mobile {
    display: none;
  }

  @media screen and (width <= 780px) {
    .pc {
      display: none;
    }

    .mobile {
      display: block;
    }
  }
</style>
