<template>
  <div style="margin: 30px 20px">
    <el-row>
      <div style="display: flex; flex-direction: row; align-items: center">
        <div style="display: flex; flex-direction: row; align-items: center">
          <a href="/" target="_blank" class="btnTmp">Mẫu</a>
          <input id="folder" type="file" webkitdirectory @change="folderChange" :disabled="loading"/>
          <label for="folder">
            <img src="../../assets/images/cloud-computing.png" alt=""/>
            Tải lên thư mục Media</label>
          <div v-if="nameFolder" style="margin-left: 20px; font-weight: bold">Tên folder: {{ nameFolder }}</div>
        </div>

      </div>
    </el-row>
  </div>
</template>

<script>
import MinIOAPI from "@/api/minioApi"

export default {
  data() {
    return {
      cover: '',
      engineSound: '',
      engineSoundFile: [],
      video: '',
      videoFile: [],
      details: [],
      img360in: [],
      img360out: [],
      coverFile: [],
      detailsFile: [],
      img360inFile: [],
      img360outFile: [],
      nameFolder: '',
      loading: false
    }
  },
  methods: {
    async uploadFile(listFile, type) {
      for (const file of listFile) {
        const p = file.webkitRelativePath.split("/")
        p.shift()
        const data = await MinIOAPI.getPreUrlUpload({ name: `${p.join("/")}` })
        const blob = new Blob([file], { type: file.type })
        await MinIOAPI.upload(data.url, blob)
        switch (type) {
          case 'cover':
            this.cover = data.path
            break
          case 'details':
            this.details.push(data.path)
            break
          case '360in':
            this.img360in.push(data.path)
            break
          case '360out':
            this.img360out.push(data.path)
            break
          case 'engineSound':
            this.engineSound = data.path
            break
          case 'video':
            this.video = data.path
            break
          default:
            break
        }
      }
    },
    async uploadFileNotImg(listFile, type) {
      for (const file of listFile) {
        switch (type) {
          case 'engineSound':
            if (file.type === 'audio/mpeg') {
              const p = file.webkitRelativePath.split("/")
              p.shift()
              const data = await MinIOAPI.getPreUrlUpload({ name: `${p.join("/")}` })
              const blob = new Blob([file], { type: file.type })
              await MinIOAPI.upload(data.url, blob)
              this.engineSound = data.path
            }
            break
          case 'video':
            if (file.type === 'video/mp4') {
              const p = file.webkitRelativePath.split("/")
              p.shift()
              const data = await MinIOAPI.getPreUrlUpload({ name: `${p.join("/")}` })
              const blob = new Blob([file], { type: file.type })
              await MinIOAPI.upload(data.url, blob)
              this.video = data.path
            }
            break
          default:
            break
        }
      }
    },
    async folderChange(event) {
      this.$emit('loading-up-media', { loading: true })
      this.loading = true
      const listFile = event.target.files
      if (listFile.length > 0) {
        const item = listFile[0].webkitRelativePath.split('/')
        this.nameFolder = item[0]
      }
      for (const item of listFile) {
        const a = item.webkitRelativePath.split('/')
        switch (a[1]) {
          case 'cover':
            this.coverFile.push(item)
            break
          case 'details':
            this.detailsFile.push(item)
            break
          case '360in':
            this.img360inFile.push(item)
            break
          case '360out':
            this.img360outFile.push(item)
            break
          case 'engineSound':
            this.engineSoundFile.push(item)
            break
          case 'video':
            this.videoFile.push(item)
            break
          default:
            break
        }
      }
      await this.uploadFile(this.detailsFile, 'details')
      await this.uploadFile(this.coverFile, 'cover')
      await this.uploadFile(this.img360inFile, '360in')
      await this.uploadFile(this.img360outFile, '360out')
      await this.uploadFileNotImg(this.engineSoundFile, 'engineSound')
      await this.uploadFileNotImg(this.videoFile, 'video')
      this.sortImage(this.details)
      this.sortImage(this.img360in)
      this.sortImage(this.img360out)
      this.$emit('update-media', {
        cover: this.cover,
        details: this.details,
        img360in: this.img360in,
        img360out: this.img360out,
        engineSound: this.engineSound,
        video: this.video
      })
      this.$emit('loading-up-media', { loading: false })
      this.loading = false
    },
    sortImage(file) {
      file.sort((a, b) => {
        if (a.slice(0, -19).length < b.slice(0, -19).length) {
          return -1
        } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
          return a.slice(0, -19).localeCompare(b.slice(0, -19))
        } else {
          return 1
        }
      })
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
