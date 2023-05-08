<template>
  <div v-loading="loadingManufacturer" class="news-form-container">
    <el-row><h2 style="font-weight: bold">{{ title }}</h2></el-row>
    <el-row style="margin-top: 12px;margin-bottom: 20px">
      <el-col style="display: flex; justify-content: flex-end; padding-right: 20px;">
        <el-button @click="handleCancel">Hủy</el-button>
        <el-button type="primary" class="btn-submit" @click="handelSend">
          {{ formType === 'create' ? 'Tạo mới' : 'Cập nhật' }}
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-form ref="formSubmit" :rules="formRules" :model="formSubmit" label-position="top">
        <el-row style="width: 100%">
          <el-form-item label="Kích hoạt" prop="active">
            <el-switch
              v-model="formSubmit.active"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
            />
          </el-form-item>
        </el-row>
        <el-row :gutter="20" style="width: 100%">
          <el-col :xl="6" :md="6">
            <el-form-item class="banner-attri" label="Tên hãng xe" prop="name">
              <el-input v-model="formSubmit.name"></el-input>
            </el-form-item>
            <el-form-item label="Hình ảnh" prop="logo">
              <div>
                <div v-if="formSubmit.logo" style="position: relative">
                  <img :src="`${config.api.domainUpload}/${formSubmit.logo}`" class="one-img" alt=""/>
                  <span class="icon-remove-img" @click="onRemoveFile('logo')">
                    <el-icon name="error"/>
                  </span>
                </div>
                <img v-else src="../../assets/images/image_placeholder.png" style="width: 100%" @click="addImg('logo')">
                <div class="el-row--flex">
                  <el-button type="text" @click="addImg('logo')">Thêm ảnh</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :md="6">
            <el-form-item label="Tiêu đề" prop="title">
              <el-input v-model="formSubmit.title"></el-input>
            </el-form-item>
            <el-form-item label="Hình ảnh giới thiệu" prop="imgIntro">
              <div>
                <div v-if="formSubmit.imgIntro" style="position: relative">
                  <img :src="`${config.api.domainUpload}/${formSubmit.imgIntro}`"
                       style="object-fit: contain; width: 100%"
                       class="one-img"
                  >
                  <span class="icon-remove-img" @click="onRemoveFile('imgIntro')">
                    <el-icon name="error"/>
                  </span>
                </div>
                <img
                  v-else
                  src="../../assets/images/image_placeholder.png"
                  style="width: 100%"
                  @click="addImg('imgIntro')"
                  alt=""
                />
                <div class="el-row--flex">
                  <el-button type="text" @click="addImg('imgIntro')">Thêm ảnh</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :md="6">
            <el-form-item label="Tên button" prop="button">
              <el-input v-model="formSubmit.button"></el-input>
            </el-form-item>
            <el-form-item label="Hình ảnh banner" prop="imgBanner">
              <div>
                <div v-if="formSubmit.imgBanner" style="position: relative">
                  <img :src="`${config.api.domainUpload}/${formSubmit.imgBanner}`"
                       style="object-fit: contain; width: 100%"
                  >
                  <span class="icon-remove-img" @click="onRemoveFile('imgBanner')">
                    <el-icon name="error"/>
                  </span>
                </div>
                <img v-else src="../../assets/images/image_placeholder.png" style="width: 100%"
                     @click="addImg('imgBanner')"
                >
                <div class="el-row--flex">
                  <el-button type="text" @click="addImg('imgBanner')">Thêm ảnh</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :md="6">
            <el-form-item class="banner-attri" label="Ghi chú" prop="note">
              <el-input autosize v-model="formSubmit.note"></el-input>
            </el-form-item>
            <el-form-item label="Hình ảnh banner mobile" prop="mobileBanner">
              <div>
                <div v-if="formSubmit.mobileBanner" style="position: relative">
                  <img :src="`${config.api.domainUpload}/${formSubmit.mobileBanner}`" class="one-img" alt=""/>
                  <span class="icon-remove-img" @click="onRemoveFile('mobileBanner')">
                    <el-icon name="error"/>
                  </span>
                </div>
                <img v-else src="../../assets/images/image_placeholder.png" style="width: 100%" @click="addImg('logo')">
                <div class="el-row--flex">
                  <el-button type="text" @click="addImg('mobileBanner')">Thêm ảnh</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="width: 100%; margin-bottom: 50px; margin-left: 10px; padding-right: 30px">
          <el-form-item label="Nội dung" prop="content">
            <EditorComponent
              v-if="!loadingManufacturer && formType!==''"
              :content="formSubmit.content"
              :type-form="formType"
              @content-html-change="handleHTML"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <el-dialog
      :title="formTypeImg ==='logo' ? 'Hình ảnh Logo' : (formTypeImg === 'imgIntro' ? 'Hình ảnh giới thiệu' : (formTypeImg==='mobileBanner'? 'Hình ảnh banner mobile' : 'Hình ảnh banner'))"
      :visible.sync="dialogImgVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <div>
        <file-pond
          ref="pond"
          v-if="formTypeImg === 'logo'"
          allow-image-preview="true"
          class-name="file-pond1"
          name="file"
          allow-remove="false"
          label-idle="Tải lên ảnh"
          allow-multiple="false"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="logo"
          :server="serverLogo"
          credits="false"
          instant-upload="true"
        />
        <file-pond
          ref="pond"
          v-else-if="formTypeImg === 'imgIntro'"
          allow-image-preview="true"
          class-name="file-pond1"
          allow-remove="false"
          name="file"
          label-idle="Tải lên ảnh"
          allow-multiple="false"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="imgIntro"
          :server="serverIntro"
          credits="false"
          instant-upload="true"
        />
        <file-pond
          ref="pond"
          v-else-if="formTypeImg==='mobileBanner'"
          allow-image-preview="true"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="false"
          allow-multiple="false"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="imgBannerMobile"
          :server="serverBannerMobile"
          credits="false"
          instant-upload="true"
        />
        <file-pond
          ref="pond"
          v-else
          allow-image-preview="true"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="false"
          allow-multiple="false"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="imgBanner"
          :server="serverBanner"
          credits="false"
          instant-upload="true"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/utils/config"
import { validText } from "@/utils/validate"
import vueFilePond, { setOptions } from 'vue-filepond'
import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import EditorComponent from "@/components/Editor"
import MinIOAPI from "@/api/minioApi"
import ManufacturerAPI from "@/api/properties/manufacturerApi"

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageResize
)

setOptions({
  styleLoadIndicatorPosition: "center top",
  styleProgressIndicatorPosition: "right top",
  styleButtonRemoveItemPosition: "left top",
  styleButtonProcessItemPosition: "right top",
  labelFileProcessing: 'Đang tải',
  labelTapToCancel: 'Bấm để hủy',
  labelTapToUndo: '',
  labelFileProcessingComplete: 'Thành công',
})

export default {
  components: {
    FilePond,
    EditorComponent
  },

  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đầy đủ trường'))
      } else {
        callback()
      }
    }
    return {
      title: '',
      logo: [],
      imgIntro: [],
      imgBanner: [],
      imgBannerMobile: [],
      serverLogo: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.formSubmit.logo = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverIntro: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.formSubmit.imgIntro = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverBanner: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.formSubmit.imgBanner = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverBannerMobile: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.formSubmit.mobileBanner = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      config,
      formSubmit: {
        name: '',
        logo: '',
        note: '',
        title: '',
        content: '',
        button: '',
        imgIntro: '',
        imgBanner: '',
        mobileBanner: '',
        active: 1,
      },
      formRules: {
        logo: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng cập nhật hình ảnh!',
          validator: validateText
        }],
        imgBanner: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng cập nhật hình ảnh!',
          validator: validateText
        }],
        imgIntro: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng cập nhật hình ảnh!',
          validator: validateText
        }],
        name: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập tên hãng xe!',
            validator: validateText
          }
        ],
        title: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập tiêu đề!',
            validator: validateText
          }
        ],
        content: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập nội dung!',
            validator: validateText
          }
        ],
      },
      formType: '',
      ManufacturerId: this.$route.params.id,
      loadingManufacturer: false,
      formTypeImg: '',
      dialogImgVisible: false
    }
  },
  mounted() {
    if (this.ManufacturerId !== '0') {
      this.title = "Cập nhật thông tin hãng xe"
      this.formType = 'edit'
      this.loadFormEdit()
    } else {
      this.title = "Tạo mới hãng xe"
      this.formType = 'create'
    }
  },
  methods: {
    onRemoveFile(prams) {
      if (prams === 'logo') {
        this.formSubmit.logo = ''
        this.logo = []
      } else if (prams === 'imgIntro') {
        this.formSubmit.imgIntro = ''
        this.imgIntro = []
      } else if (prams === 'mobileBanner') {
        this.formSubmit.mobileBanner = ''
        this.imgBannerMobile = []
      } else {
        this.formSubmit.imgBanner = ''
        this.imgBanner = []
      }
    },
    async addImg(params) {
      this.formTypeImg = params
      if (this.formTypeImg === 'logo' && this.formSubmit.logo) {
        this.logo = [await this.getImageFilePreview(this.formSubmit.logo)]
      } else if (this.formTypeImg === 'imgIntro' && this.formSubmit.imgIntro) {
        this.imgIntro = [await this.getImageFilePreview(this.formSubmit.imgIntro)]
      } else if (this.formTypeImg === 'imgBanner' && this.formSubmit.imgBanner) {
        this.imgBanner = [await this.getImageFilePreview(this.formSubmit.imgBanner)]
      } else if (this.formTypeImg === 'mobileBanner' && this.formSubmit.mobileBanner) {
        this.imgBannerMobile = [await this.getImageFilePreview(this.formSubmit.mobileBanner)]
      }
      this.dialogImgVisible = true
    },
    handleHTML(data) {
      this.formSubmit.content = data
    },
    async loadFormEdit() {
      try {
        this.loadingManufacturer = true
        const data = await ManufacturerAPI.getById(this.ManufacturerId)
        this.formSubmit = {
          note: data.note,
          logo: data.logo,
          name: data.name,
          active: data.active,
          imgIntro: data.img,
          imgBanner: data.banner,
          title: data.title,
          content: data.content,
          button: data.buttonName,
          mobileBanner: data.mobileBanner
        }
        this.loadingManufacturer = false
      } catch (err) {
        console.log(err)
      }
    },
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    async handelSend() {
      await this.$refs.formSubmit.validate(async valid => {
        if (valid) {
          const dataSubmit = {
            note: this.formSubmit.note,
            logo: this.formSubmit.logo,
            name: this.formSubmit.name,
            active: this.formSubmit.active,
            img: this.formSubmit.imgIntro,
            banner: this.formSubmit.imgBanner,
            title: this.formSubmit.title,
            content: this.formSubmit.content,
            buttonName: this.formSubmit.button,
            mobileBanner: this.formSubmit.mobileBanner
          }
          try {
            this.loadingManufacturer = true
            if (this.formType === 'create') {
              await ManufacturerAPI.create(dataSubmit)
            } else {
              await ManufacturerAPI.update(this.ManufacturerId, dataSubmit)
            }
            this.loadingManufacturer = false
          } catch (err) {
            this.loadingManufacturer = false
          }
          this.handleCancel()
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push('/quan-ly-thuoc-tinh/hang-xe')
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

.one-img {
  object-fit: cover;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  width: 100%;
}

.icon-remove-img {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 9;
  cursor: pointer;

  i {
    font-size: 24px;
    color: black;
  }
}

.icon-remove-img:hover {
  i:hover {
    color: #f56c6c;
    cursor: pointer;
  }
}
</style>
