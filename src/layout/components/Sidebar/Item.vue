<template functional>
  <div>
    <i v-if="props.icon && props.icon.includes('el-icon')" :class="[props.icon, 'sub-el-icon']"/>
    <svg-icon v-else-if="props.icon && !props.icon.includes('el-icon')" :icon-class="props.icon" class="sub-el-icon"/>
    <span v-if="props.title" :title="props.title" slot="title" class="title-custom">{{ props.title }}</span>
  </div>
</template>

<!--<script>-->

<!--export default {-->
<!--  name: 'MenuItem',-->
<!--  props: {-->
<!--    icon: {-->
<!--      type: String,-->
<!--      default: ''-->
<!--    },-->
<!--    title: {-->
<!--      type: String,-->
<!--      default: ''-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}

.title-custom {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 85% !important;
}
</style>
