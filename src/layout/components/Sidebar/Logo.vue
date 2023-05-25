<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link key="expand" class="sidebar-logo-link" to="/">
        <img src="@/assets/images/logo-full.png" alt="" class="logo"/>
      </router-link>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  object-fit: cover;
  height: fit-content;
  width: 75%;
}

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  &.collapse {
    .sidebar-logo-link {
      display: flex !important;
      align-items: center;
      justify-content: center;
      padding-left: 10px;
    }
  }

  & .sidebar-logo-link {
    display: flex !important;
    align-items: center;
    padding-left: 20px;
    justify-content: flex-start;
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 200px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 18px !important;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
