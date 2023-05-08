<template>
  <div v-loading="loading" class="news-form-container">
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
          <el-form-item label="Kích hoạt">
            <el-switch
              v-model="formSubmit.active"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
            />
          </el-form-item>
        </el-row>
        <el-row :gutter="20" style="width: 100%">
          <el-col :xl="8" :md="8">

            <el-form-item label="Tên popup" prop="name">
              <el-input v-model="formSubmit.name"></el-input>
            </el-form-item>
            <el-form-item
              label="Màn hình hiển thị"
              label-width="150px"
              prop="screen"
            >
              <el-select v-model="formSubmit.screen" placeholder="Chọn màn hình hiển thị">
                <el-option
                  v-for="item in config.listScreensForums"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Hiển thị sau x(s)" prop="displayTime">
              <el-input-number v-model="formSubmit.displayTime" :min="1" style="width: 100%"/>
            </el-form-item>
            <el-form-item label="Link" prop="url">
              <el-input v-model="formSubmit.url" type="textarea" :autosize="{minRows: 3}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="8">
            <el-form-item label="Hình ảnh" prop="image">
              <div>
                <div v-if="formSubmit.image" style="position: relative">
                  <img :src="`${config.api.domainUpload}/${formSubmit.image}`"
                       style="object-fit: contain; width: 100% ; border-radius: 5px"
                  >
                  <span class="icon-remove-img" @click="onRemoveFile('image')">
                    <el-icon name="error"/>
                  </span>
                </div>
                <img v-else src="../../../assets/images/image_placeholder.png" style="width: 100%"
                     @click="addImg('image')"
                >
                <div class="el-row--flex">
                  <el-button type="text" @click="addImg('image')">Thêm ảnh</el-button>
                </div>
              </div>
            </el-form-item>

          </el-col>
          <el-col :xl="8" :md="8">
            <el-form-item label="Hình ảnh mobile">
              <div>
                <div v-if="formSubmit.mobileImage" style="position: relative">
                  <img :src="`${config.api.domainUpload}/${formSubmit.mobileImage}`"
                       style="object-fit: contain; width: 100%; border-radius: 5px"
                  >
                  <span class="icon-remove-img" @click="onRemoveFileMobile">
                    <el-icon name="error"/>
                  </span>
                </div>
                <img v-else src="../../../assets/images/image_placeholder.png" style="width: 100%"
                     @click="addImg('mobile')"
                >
                <div class="el-row--flex">
                  <el-button type="text" @click="addImg('mobile')">Thêm ảnh</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-dialog
      title="Thêm ảnh"
      :visible.sync="dialogImgVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <div>
        <file-pond
          className="file-pond1"
          ref="pond"
          name="file"
          v-if="typeImage === 'image'"
          label-idle="Tải lên ảnh"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh!"
          :files="myFiles"
          :server="server"
          credits="false"
          instantUpload="true"
        />
        <file-pond
          className="file-pond1"
          ref="pond"
          name="file"
          v-else
          label-idle="Tải lên ảnh"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh!"
          :files="myFilesMobile"
          :server="serverMobile"
          credits="false"
          instantUpload="true"
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
import MinIOAPI from "@/api/minioApi"
import PopupForumsAPI from "@/api/popupForumsApi"

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
    FilePond
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
      myFiles: [],
      myFilesMobile: [],
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.formSubmit.image = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverMobile: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.formSubmit.mobileImage = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      config,
      typeImage: '',
      formSubmit: {
        image: '',
        name: '',
        active: 0,
        screen: '',
        url: '',
        displayTime: 1,
        mobileImage: ''
      },
      formRules: {
        image: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng cập nhật hình ảnh!',
          validator: validateText
        }],
        displayTime: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng thời gian hiển thị (s)',
            validator: validateText
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập tên popup!',
            validator: validateText
          }
        ],
        screen: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng chọn màn hình hiển thị!',
            validator: validateText
          }
        ],
      },
      formType: '',
      PopupId: this.$route.params.id,
      loading: false,
      dialogImgVisible: false
    }
  },
  mounted() {
    if (this.PopupId !== '0') {
      this.title = "Cập nhật thông tin Popup Forums"
      this.formType = 'edit'
      this.loadFormEdit()
    } else {
      this.title = "Tạo mới Popup Forums"
      this.formType = 'create'
    }
  },
  methods: {
    onRemoveFile() {
      this.formSubmit.image = ''
      this.myFiles = []
    },
    onRemoveFileMobile() {
      this.formSubmit.mobileImage = ''
      this.myFilesMobile = []
    },
    async addImg(params) {
      this.typeImage = params
      if (this.typeImage === 'image' && this.formSubmit.image) {
        this.myFiles = [await this.getImageFilePreview(this.formSubmit.image)]
      }
      if (this.typeImage === 'mobile' && this.formSubmit.mobileImage) {
        this.myFilesMobile = [await this.getImageFilePreview(this.formSubmit.mobileImage)]
      }
      this.dialogImgVisible = true
    },
    async loadFormEdit() {
      try {
        this.loading = true
        const data = await PopupForumsAPI.getById(this.PopupId)
        this.formSubmit = { ...data }
        this.loading = false
        if (this.formSubmit.image) {
          this.myFiles = [await this.getImageFilePreview(this.formSubmit.image)]
        }
        if (this.formSubmit.mobileImage) {
          this.myFilesMobile = [await this.getImageFilePreview(this.formSubmit.mobileImage)]
        }
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
    refreshForm() {
      this.formSubmit = {
        image: '',
        name: '',
        active: 0,
        screen: '',
        url: '',
        displayTime: 1
      }
    },
    async handelSend() {
      await this.$refs.formSubmit.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            if (this.formType === 'create') {
              await PopupForumsAPI.create(this.formSubmit)
            } else {
              await PopupForumsAPI.update(this.formSubmit, this.PopupId)
            }
            this.loading = false
          } catch (err) {
            this.loading = false
          }
          this.refreshForm()
          this.$router.push({
            path: '/popup-forums/danh-sach',
          })
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push({
        path: '/popup-forums/danh-sach',
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

.one-img {
  object-fit: cover;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  width: 100%;
  max-width: 500px;
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
