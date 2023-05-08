<template>
  <div v-loading="loadingForm" class="news-form-container">
    <div style="display:flex; justify-content: space-between; flex-direction: row; align-items: center">
      <h2 style="font-weight: bold">Thêm mới xe <span style="color: #0A9F46">{{ nameCar }}</span> từ Odoo</h2>
      <div style="display:flex; justify-content: space-between; flex-direction: row; align-items: center">
        <el-button
          type="primary"
          size="large"
          plain
          icon="el-icon-back"
          style="border-radius: 10px"
          @click="handleCancel"
        >Trở về
        </el-button>
        <el-button
          type="primary"
          size="large"
          icon="el-icon-check"
          style="border-radius: 10px"
          @click="handleSubmit"
        >Lưu
        </el-button>
      </div>
    </div>
    <div v-if="formMessage.length > 0">
      <div v-for="mes in formMessage">
        <li style="color: #f56c6c">{{ mes }}</li>
      </div>
    </div>
    <UploadMedia @update-media="handleUpdateMedia" @loading-up-media="handleLoadingUpMedia"/>
    <div v-loading="loadingUpMedia" element-loading-text="Đang tải">
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-row>
          <el-col :xl="12" :lg="12">
            <el-form-item label="Ảnh cover" prop="imgCover">
              <div v-if="form.imgCover">
                <img
                  :src="`${config.api.domainUpload}/${form.imgCover}`"
                  alt=""
                  width="40%"
                  class="img-item one-img"
                >
                <span class="icon-remove-img icon-remove-img-cover" @click="removeImgCover">
                  <el-icon name="error"/>
                </span>
              </div>
              <img v-else src="../../../assets/images/car_placeholder.jpg" width="40%" alt="">
              <div v-if="!form.imgCover" class="el-row--flex">
                <el-button type="text" @click="addImg('cover')">Thêm ảnh cover</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :lg="12">
            <el-form-item label="Tiếng động cơ">
              <audio v-if="form.engineSound && !audioErorr" controls>
                <source
                  :src="`https://dev-storage.carpla.dev/dev-carpla-tc/${form.engineSound}`"
                  type="audio/mpeg"
                >
                Your browser does not support the audio element.
              </audio>
              <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 20px">
                <a-upload
                  v-model="form.engineSound"
                  :custom-request="handleUploadFile"
                  :before-upload="beforeUploadAudio"
                >
                  <a-button>
                    <i
                      v-if="loadingUploadAudio"
                      class="el-icon-loading"
                      style="margin-right: 5px"
                    />
                    <el-icon v-else name="upload2" style="margin-right: 5px"/>
                    Tải lên file audio
                  </a-button>
                </a-upload>
                <div v-if="audioErorr" style="color:red; margin-left: 20px">{{ audioErorr }}</div>
              </div>
              <div
                v-if="form.engineSound && audioErorr === ''"
                style=" display: flex;flex-direction: row; margin-bottom: 20px"
              >{{ form.engineSound }}
                <div style="margin-left: 20px" @click="removeMp3File">
                  <el-icon name="delete" class="icon-remove"/>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :xl="12" :lg="12">
            <el-form-item label="Ảnh chi tiết xe" prop="imgDetail">
              <div v-if="form.imgDetail && form.imgDetail.length" class="img-list-grid">
                <div
                  v-for="(path, idx) in form.imgDetail"
                  :key="'img-details' + idx"
                  class="img-item"
                >
                  <img
                    :src="`${config.api.domainUpload}/${path}`"
                    width="100%"
                    height="200px"
                    style="object-fit: cover;border-radius: 5px;"
                  >
                  <span class="icon-remove-img" @click="removeImgFormEdit(path, idx)">
                    <el-icon name="error"/>
                  </span>
                </div>
              </div>
              <img
                v-else
                src="../../../assets/images/car_placeholder.jpg"
                width="80%"
                height="300px"
                class="one-img"
              >
              <div class="el-row--flex">
                <el-button type="text" @click="addImg('details')">
                  Thêm ảnh chi tiết xe ({{ form.imgDetail.length || 0 }})
                </el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :lg="12">
            <el-form-item label="Video" prop="video">
              <div
                v-loading="loadingUploadVideo"
                element-loading-text="Loading..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.3)"
                style="width: 80%; height: 300px; display: flex;"
              >
                <video v-if="form.video && !videoErorr && !loadingUploadVideo" width="auto" height="300" controls>
                  <source :src="`${config.api.domainUploadFile}/${form.video}`" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
                <img
                  v-else-if="!loadingUploadVideo"
                  src="../../../assets/images/video-placeholder.jpg"
                  width="80%"
                  height="300px"
                  class="img-item one-img"
                >
              </div>
              <div
                v-if="form.video && videoErorr === ''"
                style=" display: flex;flex-direction: row; margin-bottom: 20px"
              >{{ form.video }}
                <div style="margin-left: 20px" @click="removeVideo">
                  <el-icon name="delete" class="icon-remove"/>
                </div>
              </div>
              <div
                style="display: flex; flex-direction: row; align-items: center; margin-bottom: 20px; margin-top: 10px"
              >
                <a-upload
                  :custom-request="handleUploadVideo"
                  :before-upload="beforeUploadVideo"
                >
                  <a-button>
                    <i
                      v-if="loadingUploadVideo"
                      class="el-icon-loading"
                      style="margin-right: 5px"
                    />
                    <el-icon v-else name="upload2" style="margin-right: 5px;"/>
                    Tải lên video
                  </a-button>
                </a-upload>
                <div v-if="videoErorr" style="color:#f56c6c; margin-left: 20px">{{ videoErorr }}</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :xl="12" :lg="24">
            <el-form-item label="Ảnh nội thất 360" prop="img360in">
              <el-carousel
                v-if="form.img360in && form.img360in.length"
                :autoplay="false"
                trigger="click"
                indicator-position="none"
                type="card"
                height="250px"
              >
                <el-carousel-item v-for="(path, idx) in form.img360in" :key="'img-360in-' + idx">
                  <img
                    :src="`${config.api.domainUpload}/${path}`"
                    alt=""
                    width="100%"
                    height="100%"
                    class="img-item one-img"
                  >
                </el-carousel-item>
              </el-carousel>
              <img v-else src="../../../assets/images/car_placeholder.jpg" width="80%" height="300px">
              <div class="el-row--flex is-justify-center">
                <el-button type="text" @click="addImg('360in')">
                  Thêm ảnh nội thất 360 ({{ form.img360in.length || 0 }})
                </el-button>
              </div>
              <a-upload
                :custom-request="handleUploadFolder"
                directory
                style="margin-left: 12px"
                @change="uploadFolder360in"
              >
                <a-button>
                  <el-icon name="upload2" style="margin-right: 5px"/>
                  Tải lên thư mục
                </a-button>
              </a-upload>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :lg="24">
            <el-form-item label="Ảnh ngoại thất 360" prop="img360">
              <el-carousel
                v-if="form.img360 && form.img360.length"
                :autoplay="false"
                trigger="click"
                indicator-position="none"
                type="card"
                height="250px"
              >
                <el-carousel-item v-for="(path, idx) in form.img360" :key="'img-360-' + idx">
                  <img
                    :src="`${config.api.domainUpload}/${path}`"
                    alt=""
                    width="100%"
                    height="100%"
                    class="img-item one-img"
                  >
                </el-carousel-item>
              </el-carousel>
              <img v-else src="../../../assets/images/car_placeholder.jpg" width="80%" height="300px">
              <div class="el-row--flex is-justify-center">
                <el-button type="text" @click="addImg('360')">
                  Thêm ảnh ngoại thất 360 ({{ form.img360.length || 0 }})
                </el-button>
              </div>
              <a-upload
                :custom-request="handleUploadFolder"
                directory
                style="margin-left: 12px"
                @change="uploadFolder360"
              >
                <a-button>
                  <el-icon name="upload2" style="margin-right: 5px"/>
                  Tải lên thư mục
                </a-button>
              </a-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog
      :title="formTypeImg ==='cover' ? 'Ảnh cover' : (formTypeImg === 'details' ? 'Ảnh chi tiết xe' : (formTypeImg === '360' ? 'Ảnh ngoại thất 360' : 'Ảnh nội thất 360'))"
      :visible.sync="dialogImgVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <div>
        <file-pond
          v-if="formTypeImg === 'cover'"
          ref="pond"
          allow-image-preview="true"
          class-name="file-pond1"
          label-idle="Tải lên ảnh"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="imageCover"
          :server="serverImgCover"
          credits="false"
          instant-upload="true"
          @removefile="removeImgCover"
        />
        <file-pond
          v-else-if="formTypeImg === 'details'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="imgDetails"
          :server="serverImgDetails"
          credits="false"
          instant-upload="true"
        />
        <div
          v-if="formTypeImg === 'details' && form.imgDetail && form.imgDetail.length"
          class="el-row--flex is-justify-end"
          style="margin-bottom: 15px"
        >
          <el-button type="danger" plain icon="el-icon-delete" @click="removeAllImgDetails">Xóa tất cả</el-button>
        </div>
        <div v-if="formTypeImg === 'details' && form.imgDetail.length > 0" class="img-360-grid">
          <div
            v-for="(path, idx) in form.imgDetail"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              class="one-img"
            >
            <span class="icon-remove-img" @click="removeImgDetailFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>
        <file-pond
          v-else-if="formTypeImg === '360'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="img360"
          :server="serverImg360"
          credits="false"
          instant-upload="true"
        />
        <div
          v-if="formTypeImg === '360' && form.img360 && form.img360.length"
          class="el-row--flex is-justify-end"
          style="margin-bottom: 15px"
        >
          <el-button type="danger" plain icon="el-icon-delete" @click="removeAllImg360">Xóa tất cả</el-button>
        </div>
        <div v-if="formTypeImg === '360' && form.img360.length > 0" class="img-360-grid">
          <div
            v-for="(path, idx) in form.img360"
            :key="'img-360' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              class="one-img"
            >
            <span class="icon-remove-img" @click="removeImg360FormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>
        <file-pond
          v-else-if="formTypeImg === '360in'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="img360in"
          :server="serverImg360in"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === '360in' && form.img360in.length > 0" class="img-360-grid">
          <div
            v-for="(path, idx) in form.img360in"
            :key="'img-360in' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              class="one-img"
            >
            <span class="icon-remove-img" @click="removeImg360inFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import { validText } from "@/utils/validate"
import config from '@/utils/config'
import CarAPI from '@/api/carApi'
import vueFilePond, { setOptions } from "vue-filepond"
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import request from '@/utils/request'
import MinIOAPI from '@/api/minioApi'
import UploadMedia from "@/views/manageCar/UploadMedia"

setOptions({
  styleLoadIndicatorPosition: "right top",
  styleProgressIndicatorPosition: "right top",
  styleButtonRemoveItemPosition: "left top",
  styleButtonProcessItemPosition: "right top",
  labelFileProcessing: 'Đang tải',
  labelTapToCancel: 'Bấm để hủy',
  labelTapToUndo: '',
  labelFileProcessingComplete: 'Thành công',
})

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageResize
)

export default {
  components: { FilePond, UploadMedia },
  data() {
    const validateNumberImg = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Không được để trống'))
      } else {
        if (value.length === 0) {
          callback(new Error('Hãy chọn ảnh chi tiết'))
        } else if (value.length < 6) {
          callback(new Error('Tối thiểu phải có 6 ảnh chi tiết'))
        } else {
          callback()
        }
      }
    }
    return {
      nameCar: '',
      config,
      audioErorr: '',
      formMessage: [],
      dialogFormVisible: false,
      dialogImgVisible: false,
      dialogAudioVisible: true,
      formTypeImg: 'cover',
      imgDetails: [],
      mp3File: [],
      imageCover: [],
      serverImgCover: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCover/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.imgCover = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverImgDetails: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carDetail/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.imgDetail.push(data.path)
            this.form.imgDetail.sort((a, b) => {
              if (a.slice(0, -19).length < b.slice(0, -19).length) {
                return -1
              } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
                return a.slice(0, -19).localeCompare(b.slice(0, -19))
              } else {
                return 1
              }
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverImg360: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          const data = await MinIOAPI.getPreUrlUpload({ name: `car360/${file.name}` })
          await MinIOAPI.upload(data.url, file)
          this.form.img360.push(data.path)
          this.form.img360.sort((a, b) => {
            if (a.slice(0, -19).length < b.slice(0, -19).length) {
              return -1
            } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            } else {
              return 1
            }
          })
          return load(file)
        },
        revert: null
      },
      serverImg360in: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          const data = await MinIOAPI.getPreUrlUpload({ name: `car360/${file.name}` })
          await MinIOAPI.upload(data.url, file)
          this.form.img360in.push(data.path)
          this.form.img360in.sort((a, b) => {
            if (a.slice(0, -19).length < b.slice(0, -19).length) {
              return -1
            } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            } else {
              return 1
            }
          })
          return load(file)
        },
        revert: null
      },
      typeProperties: '',
      videoErorr: '',
      form: {
        img360: [],
        img360in: [],
        video: '',
        engineSound: '',
        imgCover: '',
        imgDetail: [],
        carOdooId: ''
      },
      formRules: {
        imgCover: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn ảnh cover',
        }],
        imgDetail: [{
          required: true,
          trigger: 'blur',
          validator: validateNumberImg
        }],
        img360: [{
          required: false,
          trigger: 'blur',
          message: 'Vui lòng chọn ảnh 360',
        }],
      },
      dataOdoo: [],
      formType: '',
      carId: this.$route.params.id,
      loadingForm: false,
      img360: [],
      img360in: [],
      loadingUploadAudio: false,
      loadingUploadVideo: false,
      loadingUpMedia: false
    }
  },
  async mounted() {
    this.loadingForm = true
    if (this.carId) {
      const data = await CarAPI.getCarOdooID(this.carId)
      this.nameCar = data.name
      this.form.carOdooId = data._id
    }
    this.loadingForm = false
  },
  methods: {
    async handleUploadFolder(res) {
    },
    async uploadFolder360({ file, fileList }) {
      const { url, path } = await request({
        url: `${config.api.minio}?name=${file.name}`,
        method: 'get'
      })

      await fetch(url, {
        method: 'put',
        body: file.originFileObj,
        headers: {
          'Content-Type': 'image/jpeg'
        }
      })
      this.form.img360.push(path)
      this.form.img360.sort((a, b) => {
        if (a.slice(0, -19).length < b.slice(0, -19).length) {
          return -1
        } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
          return a.slice(0, -19).localeCompare(b.slice(0, -19))
        } else {
          return 1
        }
      })
    },
    async uploadFolder360in({ file, fileList }) {
      const { url, path } = await request({
        url: `${config.api.minio}?name=${file.name}`,
        method: 'get'
      })

      await fetch(url, {
        method: 'put',
        body: file.originFileObj,
        headers: {
          'Content-Type': 'image/jpeg'
        }
      })

      this.form.img360in.push(path)
      this.form.img360in.sort((a, b) => {
        if (a.slice(0, -19).length < b.slice(0, -19).length) {
          return -1
        } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
          return a.slice(0, -19).localeCompare(b.slice(0, -19))
        } else {
          return 1
        }
      })
    },
    beforeUploadVideo(file) {
      const isAudio = file.type === 'video/mp4'
      this.videoErorr = ''
      if (!isAudio) {
        this.videoErorr = `${file.name} không đúng định dạng!`
      } else {
        this.videoErorr = ''
      }
    },
    async handleUploadVideo(res) {
      this.form.video = undefined
      this.loadingUploadVideo = true
      if (!this.videoErorr) {
        const file = res.file
        const { url, path } = await request({
          url: `${config.api.minio}?name=${file.name}`,
          method: 'get'
        })

        await fetch(url, {
          method: 'put',
          body: file,
          headers: {
            'Content-Type': 'video/mp4'
          }
        })
        this.form.video = path
      }
      this.loadingUploadVideo = false
      return Promise.resolve()
    },
    beforeUploadAudio(file) {
      const isAudio = file.type === 'audio/mpeg'
      this.audioErorr = ''
      if (!isAudio) {
        this.audioErorr = `${file.name} không phải mp3 file!`
      } else {
        this.audioErorr = ''
      }
    },
    async handleUploadFile(res) {
      this.form.engineSound = undefined
      this.loadingUploadAudio = true
      if (!this.audioErorr) {
        const file = res.file
        const { url, path } = await request({
          url: `${config.api.minio}?name=${file.name}`,
          method: 'get'
        })

        await fetch(url, {
          method: 'put',
          body: file,
          headers: {
            'Content-Type': 'audio/mpeg'
          }
        })
        this.form.engineSound = path
      }
      this.loadingUploadAudio = false
      return Promise.resolve()
    },
    removeAllImgDetails() {
      this.form.imgDetail = []
    },
    removeAllImg360() {
      this.form.img360 = []
    },
    removeImg360FormEdit(path, index) {
      this.form.img360.splice(index, 1)
    },
    removeImg360inFormEdit(path, index) {
      this.form.img360in.splice(index, 1)
    },
    removeImgDetailFormEdit(path, index) {
      this.form.imgDetail.splice(index, 1)
    },
    removeVideo(err, file) {
      this.form.video = ''
    },
    removeImgDetail(err, file) {
      const obj = this.form.imgDetail.find(item => item.includes(file.filenameWithoutExtension))
      const index = this.form.imgDetail.indexOf(obj)
      this.form.imgDetail.splice(index, 1)
    },
    removeImgCover(err, file) {
      this.form.imgCover = undefined
    },
    removeMp3File(err, file) {
      this.form.engineSound = ''
    },
    removeImg360(err, file) {
      const obj = this.form.img360.find(item => item.includes(file.filenameWithoutExtension))
      const index = this.form.img360.indexOf(obj)
      this.form.img360.splice(index, 1)
    },
    removeImg360in(err, file) {
      const obj = this.form.img360in.find(item => item.includes(file.filenameWithoutExtension))
      const index = this.form.img360in.indexOf(obj)
      this.form.img360in.splice(index, 1)
    },
    addImg(type) {
      this.formTypeImg = type
      this.dialogImgVisible = true
    },
    removeImgFormEdit(path, index) {
      this.form.imgDetail.splice(index, 1)
    },
    async loadFormOdoo() {
      try {
        this.loadingForm = true
        const data = await CarAPI.getCarOdooID(this.carId)
        this.nameCar = data.name
        this.loadingForm = false
        this.form = {
          ...data,
          color: data?.colorId?._id,
          attributes: {
            manufacturer: data.manufacturerId?._id,
            brand: data.brandId?._id,
            drive: data.driveId?._id,
            figure: data.figureId?._id,
            fuel: data.fuelId?._id,
            gear: data.gearId?._id,
            origin: data.originId?._id,
          },
        }
        // this.form = {
        //   active: data.active || 0,
        //   branch: data.branch || '',
        //   salePolicy: data.salePolicy || '',
        //   certification: data.certification || 1,
        //   carOdooId: data._id?.toString() || '',
        //   listedPrice: data.listedPrice || 0,
        //   img360: data.img360 || [],
        //   img360in: data.img360in || [],
        //   video: data.video || '',
        //   engineSound: data.engineSound || '',
        //   name: data.name || '',
        //   price: data.price || 0,
        //   province: data.province || "",
        //   ownerNumber: data.ownerNumber || '',
        //   odo: data.odo || 0,
        //   licensePlates: data.licensePlates || '',
        //   imgCover: data.imgCover || '',
        //   imgDetail: data.imgDetail || [],
        //   note: data.note || '',
        //   nicePlateNumber: data.nicePlateNumber || 0,
        //   plateNumberType: data.plateNumberType || '',
        //   plateNumberColor: data.plateNumberColor || '',
        //   vinNumber: data.vinNumber || '',
        //   color: data?.colorId?._id,
        //   attributes: {
        //     manufacturer: data.manufacturerId?._id,
        //     brand: data.brandId?._id,
        //     drive: data.driveId?._id,
        //     figure: data.figureId?._id,
        //     fuel: data.fuelId?._id,
        //     gear: data.gearId?._id,
        //     origin: data.originId?._id,
        //     year: data.year || '',
        //     engine: data.engine || '',
        //     numberSeat: data.numberSeat || '',
        //     version: data.version || '',
        //     cc: data.cc || '',
        //     horsePower: data.horsePower || '',
        //     torque: data.torque || '',
        //     size: data.size || ''
        //   },
        //   general: data.general || '',
        //   highlights: data.highlights || '',
        //   warrantyPolicy: data.warrantyPolicy || '',
        //   warrantyNetwork: data.warrantyNetwork || '',
        //   promotion: data.promotion || '',
        // }
        if (data.state) {
          switch (data.state) {
            case 7:
              this.form.status = 1
              break
            case 8:
              this.form.status = 1
              break
            case 9:
              this.form.status = 1
              break
            case 10:
              this.form.status = 2
              break
            case 11:
              this.form.status = 3
              break
            case 12:
              this.form.status = 4
              break
            default:
              this.form.status = 1
              break
          }
        }
      } catch (err) {
        console.log(err)
        this.loadingForm = false
      }
    },
    handleAdd(type) {
      this.typeProperties = type
      this.dialogFormVisible = true
    },
    handleCancel() {
      this.$router.push('/quan-ly-xe/danh-sach-xe-odoo')
    },
    handleUpdateMedia(data) {
      if (data.cover) this.form.imgCover = data.cover
      if (data.details.length > 0) this.form.imgDetail = data.details
      if (data.img360out.length > 0) this.form.img360 = data.img360out
      if (data.img360in.length > 0) this.form.img360in = data.img360in
      if (data.video) this.form.video = data.video
      if (data.engineSound) this.form.engineSound = data.engineSound
    },
    handleLoadingUpMedia(data) {
      this.loadingUpMedia = data.loading
    },
    async handleSubmit() {
      await this.$refs.form.validate(async(valid, messages) => {
        if (valid) {
          this.formMessage = []
          if (!this.audioErorr) {
            await CarAPI.createMedia(this.form)
            this.handleCancel()
          }
        } else {
          for (const mes in messages) {
            this.formMessage.push(messages[mes][0].message)
          }
        }
      })
    },
  }
}
</script>

<style lang="scss">
.news-form-container {
  padding: 20px;
}

.file-pond1 {
  width: 100% !important;
}

.img-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.img-360-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}

.img-item {
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  border-radius: 5px;
}

.icon-remove-img {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 9;
  cursor: pointer;

  i {
    font-size: 24px;
    color: white;
  }
}

.icon-remove-img-cover {
  left: 5px;
}

.icon-remove-img:hover {
  i:hover {
    color: #f56c6c;
    cursor: pointer;
  }
}

.ant-upload-list {
  display: none !important;
}

@media only screen and (min-width: 768px) {
  .not-hidden-sm-only {
    display: block !important
  }
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .not-hidden-md-only {
    display: block !important
  }
}

.img-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
  grid-gap: 10px;
}

.one-img {
  object-fit: cover;
  border-radius: 5px;
}

</style>

