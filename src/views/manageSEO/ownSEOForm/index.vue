<template>
  <div v-loading="loading" class="news-form-container">
    <el-row><h2 style="font-weight: bold">Cập nhật thông tin SEO</h2></el-row>
    <el-row style="margin-top: 12px;margin-bottom: 20px">
      <el-col style="display: flex; justify-content: flex-end; padding-right: 20px;">
        <el-button @click="handleCancel">Hủy</el-button>
        <el-button type="primary" class="btn-submit" @click="handleSubmit">Cập nhật
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-form ref="form" :rules="formRules" :model="form" label-position="top">
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :xl="12" :lg="12">
            <el-form-item class="banner-attri" label="Tiêu đề" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Hình ảnh cover" prop="imgCover">
              <file-pond
                ref="pond"
                allow-image-preview="true"
                class-name="file-pond1"
                name="file"
                label-idle="Tải lên ảnh"
                allow-remove="true"
                accepted-file-types="image/*"
                label-file-type-not-allowed="Không đúng định dạng ảnh"
                :files="myFiles"
                :server="server"
                credits="false"
                instant-upload="true"
                :onremovefile="onRemoveFile"
              />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :lg="12">
            <el-form-item class="banner-attri" label="Từ khóa" prop="keyword">
              <el-input v-model="form.keyword"></el-input>
            </el-form-item>

            <el-form-item class="banner-attri" label="Mô tả" prop="description">
              <el-input type="textarea" :rows="8" v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </el-row>
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
import BannerAPI from "@/api/bannerApi"
import MinIOAPI from "@/api/minioApi"
import SeoAPI from "@/api/seoApi"

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
      myFiles: [],
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.form.imgCover = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      form: {
        imgCover: '',
        title: '',
        keyword: '',
        description: '',
        active: 1
      },
      formRules: {
        title: [{ required: true, trigger: 'blur', validator: validateText }],
        description: [{ required: true, trigger: 'blur', validator: validateText }],
        imgCover: [{ required: true, trigger: 'blur', message: 'Yêu cầu tải ảnh lên' }],
        active: [{ required: true, trigger: 'blur', validator: validateText }],
        keyword: [{ required: true, trigger: 'blur', validator: validateText }],
      },
      config,
      formType: '',
      targetType: this.$router.currentRoute.query.targetType,
      ObjectId: this.$route.params.id,
      loading: false,
    }
  },
  mounted() {
    if (this.ObjectId && this.targetType) {
      this.checkHasSEO()
    }
  },
  methods: {
    async checkHasSEO() {
      this.loading = true
      switch (this.targetType) {
        case 'cateNewsId':
          SeoAPI.hasSEO({
            cateNewsId: this.ObjectId
          }).then(res => {
            this.loadFormEditIfHas(res.data)
            this.loading = false
          })
          break
        case 'newsId':
          SeoAPI.hasSEO({
            newsId: this.ObjectId
          }).then(res => {
            this.loadFormEditIfHas(res.data)
            this.loading = false
          })
          break
        case 'carId':
          SeoAPI.hasSEO({
            carId: this.ObjectId
          }).then(res => {
            this.loadFormEditIfHas(res.data)
            this.loading = false
          })
          break
        case 'recruitId':
          SeoAPI.hasSEO({
            recruitId: this.ObjectId,
          }).then(res => {
            this.loadFormEditIfHas(res.data)
            this.loading = false
          })
          break
        default:
          this.loading = false
          break
      }
    },
    async loadFormEditIfHas(data) {
      if (data.length === 0) {
        this.formType = 'create'
      } else {
        this.formType = 'edit'
        this.form._id = data[0]._id
        this.form.title = data[0].attributes.title
        this.form.imgCover = data[0].attributes.imgCover
        this.form.keyword = data[0].attributes.keyword
        this.form.description = data[0].attributes.description
        if (this.form.imgCover) {
          this.myFiles = [await this.getImageFilePreview(this.form.imgCover)]
        }
      }
    },
    onRemoveFile() {
      this.form.imgCover = undefined
      this.myFiles = []
    },
    resetForm() {
      this.form = {
        imgCover: '',
        title: '',
        keyword: '',
        description: '',
        active: 1
      }
    },
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
          if (valid) {
            let data = {
              attributes: {
                title: this.form.title,
                keyword: this.form.keyword,
                description: this.form.description,
                imgCover: this.form.imgCover,
              },
              target: {},
              type: 2,
              active: 1
            }
            switch (this.targetType) {
              case 'cateNewsId':
                data.target = {
                  cateNewsId: this.ObjectId
                }
                break
              case 'newsId':
                data.target = {
                  newsId: this.ObjectId
                }
                break
              case 'carId':
                data.target = {
                  carId: this.ObjectId
                }
                break
              case 'recruitId':
                data.target = {
                  recruitId: this.ObjectId
                }
                break
              default:
                break
            }
            if (this.formType === 'create') {
              await SeoAPI.create(data)
            } else {
              await SeoAPI.update(this.form._id, data)
            }
            this.resetForm()
            this.myFiles = []
          } else {
            console.log('Error Submit!')
            return false
          }
        }
      )
    },
    handleCancel() {
      switch (this.targetType) {
        case 'cateNewsId':
          this.$router.push('/quan-ly-tin-tuc/loai-tin-tuc')
          break
        case 'newsId':
          this.$router.push('/quan-ly-tin-tuc/tin-tuc')
          break
        case 'carId':
          this.$router.push('/quan-ly-xe/danh-sach')
          break
        case 'recruitId':

          break
        default:
          break
      }
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

</style>
