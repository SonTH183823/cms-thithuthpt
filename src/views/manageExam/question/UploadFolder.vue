<template>
  <div>
    <el-row>
      <div style="display: flex; flex-direction: row; align-items: center">
        <div style="display: flex; flex-direction: row; align-items: center">
          <input id="folder" type="file" webkitdirectory :disabled="loading" @change="folderChange"/>
          <label for="folder">
            <!--            <img src="../../assets/images/cloud-computing.png" alt=""/>-->
            Tải lên thư mục ảnh đề thi</label>
          <div v-if="nameFolder" style="margin-left: 20px; font-weight: bold">Tên folder: {{ nameFolder }}</div>
        </div>

      </div>
    </el-row>
  </div>
</template>

<script>
import UploadAPI from "@/api/uploadApi"

export default {
  data() {
    return {
      loading: false,
      nameFolder: ''
    }
  },
  methods: {
    async folderChange(event) {
      this.$emit('loading-upload', { loading: true })
      this.loading = true
      const listFile = event.target.files
      if (listFile.length > 0) {
        const item = listFile[0].webkitRelativePath.split('/')
        this.nameFolder = item[0]
      } else {
        return
      }
      const res = await UploadAPI.uploadMultipleFile(listFile)
      const listImgSrc = res.filename.map(item => item)
      this.$emit('update-images', { data: listImgSrc })
      this.loading = false
      this.$emit('loading-upload', { loading: false })
    },
  }
}
</script>

<style lang="scss">
.btnTmp {
  height: 44px;
  overflow: hidden;
  width: fit-content;
  background-color: rgb(245, 108, 108);
  border: none;
  border-radius: 10px;
  color: #fff !important;
  cursor: pointer;
  display: inline-block;
  font-weight: 500;
  outline: none;
  padding: 10px 30px;
  position: relative;
  vertical-align: middle;
  margin-right: 20px;

  &:hover {
    background-color: darken(#F56C6CFF, 5%);
    color: white;
  }

  &:active {
    color: white;
  }
}

[type="file"] {
  height: 40px;
  overflow: hidden;
  width: 0;
}

[type="file"] + label {
  background: #0A9F46;
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-weight: 500;
  outline: none;
  padding: 10px 30px;
  position: relative;
  vertical-align: middle;

  &:hover {
    background-color: darken(#0A9F46, 5%);
  }

}

</style>
