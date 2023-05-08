<template>
  <div style="margin: 50px">
    <EditorComponent @content-html-change="handleHTML"/>

    <froalaView v-model="model"></froalaView>
  </div>
</template>

<script>
import EditorComponent from "../../components/Editor/index"

export default {
  components: { EditorComponent },
  data: function() {
    return {
      model: ''
    }
  },
  methods: {
    handleHTML(data) {
      this.model = data
    },
  }
}
</script>
