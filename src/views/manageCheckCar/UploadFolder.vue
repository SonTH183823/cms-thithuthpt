<template>
  <div style="margin: 50px 20px">
    <el-row>
      <div style="display: flex; flex-direction: row; align-items: center">
        <div style="display: flex; flex-direction: row; align-items: center">
          <a href="/" target="_blank" class="btnTmp">Mẫu</a>
          <input id="folder" type="file" webkitdirectory :disabled="loading" @change="folderChange"/>
          <label for="folder">
            <img src="../../assets/images/cloud-computing.png" alt=""/>
            Tải lên thư mục ảnh</label>
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
      loading: false,
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
      carDoor: [],
      capo: [],
      carTrunk: [],
      engine: [],
      engineCrew: [],
      bottomCar: [],
      tireCar: [],
      spareTire: [],
      carDoorFiles: [],
      capoFiles: [],
      carTrunkFiles: [],
      engineFiles: [],
      engineCrewFiles: [],
      bottomCarFiles: [],
      tireCarFiles: [],
      spareTireFiles: [],
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
          case 'carDoor':
            this.carDoor.push(data.path)
            break
          case 'capo':
            this.capo.push(data.path)
            break
          case 'carTrunk':
            this.carTrunk.push(data.path)
            break
          case 'engine':
            this.engine.push(data.path)
            break
          case 'engineCrew':
            this.engineCrew.push(data.path)
            break
          case 'bottomCar':
            this.bottomCar.push(data.path)
            break
          case 'tireCar':
            this.tireCar.push(data.path)
            break
          case 'spareTire':
            this.spareTire.push(data.path)
            break
          default:
            break
        }
      }
    },
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
      for (const item of listFile) {
        const a = item.webkitRelativePath.split('/')
        switch (a[1]) {
          case 'CuaXe':
            this.carDoorFiles.push(item)
            break
          case 'NapCapo':
            this.capoFiles.push(item)
            break
          case 'CopXe':
            this.carTrunkFiles.push(item)
            break
          case 'DongCo':
            this.engineFiles.push(item)
            break
          case 'OcMay':
            this.engineCrewFiles.push(item)
            break
          case 'GamXe':
            this.bottomCarFiles.push(item)
            break
          case 'LopXe':
            this.tireCarFiles.push(item)
            break
          case 'LopSoCua':
            this.spareTireFiles.push(item)
            break
          default:
            break
        }
      }
      await this.uploadFile(this.carDoorFiles, 'carDoor')
      await this.uploadFile(this.capoFiles, 'capo')
      await this.uploadFile(this.carTrunkFiles, 'carTrunk')
      await this.uploadFile(this.engineFiles, 'engine')
      await this.uploadFile(this.engineCrewFiles, 'engineCrew')
      await this.uploadFile(this.bottomCarFiles, 'bottomCar')
      await this.uploadFile(this.tireCarFiles, 'tireCar')
      await this.uploadFile(this.spareTireFiles, 'spareTire')
      this.sortImage(this.capo)
      this.sortImage(this.carDoor)
      this.sortImage(this.carTrunk)
      this.sortImage(this.engine)
      this.sortImage(this.engineCrew)
      this.sortImage(this.bottomCar)
      this.sortImage(this.tireCar)
      this.sortImage(this.spareTire)
      this.$emit('update-images', {
        carDoor: this.carDoor,
        capo: this.capo,
        carTrunk: this.carTrunk,
        engine: this.engine,
        engineCrew: this.engineCrew,
        bottomCar: this.bottomCar,
        tireCar: this.tireCar,
        spareTire: this.spareTire,
      })
      this.loading = false
      this.$emit('loading-upload', { loading: false })
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
