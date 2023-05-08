<template>
  <div class="app-wrapper">
    <app-main/>
  </div>
</template>

<script>
import { AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    AppMain
  },
  mixins: [ResizeMixin]
}
</script>

