<script setup lang="ts">
  interface Props {
    fixed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    fixed: true,
  })

  const router = useRouter()
  const route = useRoute()

  function go (path: string) {
    router.push(path)
  }
</script>

<template>
  <header :class="[props.fixed ? 'fixed' : '']" class="header">
    <nav class="nav">
      <div class="logo-box">
        <h1 class="name">模板标题</h1>
      </div>

      <div class="flex items-center justify-end">
        <ul class="menu">
          <li class="item underline-item" :class="[route.name === 'home' ? 'active' : '']" @click="go('/home')">
            首页
          </li>
          <li class="item underline-item" :class="[route.name === 'about' ? 'active' : '']" @click="go('/about')">
            关于我们
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
  $height: 66px;

  .header {
    left: 0;
    top: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .3);

    &.fixed {
      position: fixed;
      background: rgb(2 26 61 / 39%);
      z-index: 1;

      .name {
        color: #FFF !important;
      }

      .item {
        color: #FFF !important;
      }
    }

    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1240px;
      height: $height;
      margin: auto;

      .logo-box {
        display: flex;
        align-items: center;

        .logo {
          width: 38px;
          height: 38px;
        }

        .name {
          margin-left: 10px;
          font-family: "Microsoft YaHei";
          font-size: 18px;
          font-weight: bold;
          line-height: 24px;
          color: #000;
        }
      }

      .menu {
        display: flex;
        height: 100%;
        padding: 0;
        margin: 0;
        list-style: none;

        .item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: $height;
          margin: 0 34px;
          font-family: "Microsoft YaHei";
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          color: #000;
          cursor: pointer;

          &.underline-item {
            &::before {
              position: absolute;
              bottom: 0;
              left: 50%;
              width: 24px;
              height: 4px;
              content: "";
              background: #F4A81B;
              border-radius: 2px;
              opacity: 0;
              transition: all .3s;
              transform: translateX(-50%) scale(2);
            }

          }

          &:hover {
            color: var(--theme-color);

            &.underline-item {
              &::before {
                opacity: 1;
                transform: translateX(-50%);
              }
            }
          }

          &.active {
            color: var(--theme-color);

            &.underline-item {
              &::before {
                opacity: 1;
                transform: translateX(-50%);
              }
            }
          }

        }
      }
    }
  }
</style>
