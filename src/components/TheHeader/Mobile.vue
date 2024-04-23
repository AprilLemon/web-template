<script setup lang="ts">
  const showMenu = ref(false)
  const router = useRouter()
  const route = useRoute()

  function go (path: string) {
    openMenu(false)
    router.push(path)
  }

  function openMenu (val: boolean) {
    showMenu.value = val
  }

  function touchShadow (e) {
    e.preventDefault()
  }
</script>

<template>
  <div class="placeholder" />
  <div class="mobile">
    <nav class="nav">
      <div class="logo-box">
        模板标题
      </div>

      <div class="menu-icon i-carbon:menu" :class="[showMenu ? 'active' : '']" @click="showMenu ? openMenu(false) : openMenu(true)" />
    </nav>
    <ul class="menu" :class="[showMenu ? 'show' : '']">
      <li class="item" :class="[route.name === 'home' ? 'active' : '']" @click="go('/home')">
        首页
      </li>
      <li class="item" :class="[route.name === 'about' ? 'active' : '']" @click="go('/about')">
        关于我们
      </li>
      <li class="item">
        加入我们：<a class="tel" href="tel:400-7777777">1111111111</a>
      </li>
    </ul>

    <div v-if="showMenu" class="shadow-box" @touchstart="touchShadow" @click="openMenu(false)" />
  </div>
</template>

<style scoped lang="scss">
  $nav-height: 100px;

  .placeholder {
    height: $nav-height;
  }

  .mobile {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: $nav-height;
    background: #fff;

    .nav {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 10px 20px;
      border-bottom: 1px solid #eee;

      .logo-box {
        display: flex;
        align-items: center;
        font-family: "Microsoft YaHei";
        font-size: 30px;
        line-height: 24px;
        color: #000;

        .logo {
          width: 50px;
          margin-right: 15px;
        }
      }

      .menu-icon {
        font-size: 30px;
        color: #000;
        cursor: pointer;

        &.active {
          color: var(--theme-color);
        }

        &:hover {
          color: var(--theme-color);
        }
      }
    }

    .menu {
      position: absolute;
      top: $nav-height;
      left: 0;
      z-index: 2;
      width: 100%;
      padding: 0 40px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 20px 20px 0 rgb(0 0 0 / 20%);
      opacity: 0;
      transition: all .2s;
      transform: scaleY(0);
      transform-origin: top center;

      &.show {
        opacity: 1;
        transform: scale(1);
      }

      .item {
        padding: 25px 0;
        font-family: "Microsoft YaHei";
        font-size: 28px;
        font-weight: 400;
        color: rgb(0 0 0 / 70%);
        border-bottom: 1px solid #eee;

        &.active {
          color: var(--theme-color);
        }

        .tel {
          padding-bottom: 2px;
          font-style: oblique;
        }
      }
    }

    .shadow-box {
      position: fixed;
      top: $nav-height;
      left: 0;
      z-index: 1;
      width: 100vw;
      height: calc(100vh - $nav-height);
      background: rgb(0 0 0 / 20%);
    }
  }
</style>
