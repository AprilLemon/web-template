<script setup lang="ts">
  definePage({
    name: 'about',
  })
</script>

<template>
  <TheHeader :fixed="false" />
  <div class="content-box">
    <div class="content">
      关于我们
    </div>
  </div>
  <TheFooter />
</template>

<style scoped lang="scss">
  .content-box {
    .content {
      max-width: 1240px;
      margin: auto;
      padding: 157px 0 137px 0;

      @media screen and (max-width: 780px) {
        padding: 20px;
      }

      p + p {
        margin-top: 40px;
      }

      p {
        text-align: left;
        text-indent: 35px;

        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 18px;
        color: #000000;
        line-height: 36px;
      }
    }
  }
</style>
