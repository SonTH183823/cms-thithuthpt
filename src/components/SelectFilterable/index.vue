<template>
  <el-select v-model="form" filterable clearable>

  </el-select>
</template>

<script>
export default {
  name: 'SelectFilterable',
  props: {
    model: {
      type: String,
      default: ''
    }
  },
  data(props) {
    return {
      form: props.model
    }
  }
}
</script>

<style scoped>

</style>
