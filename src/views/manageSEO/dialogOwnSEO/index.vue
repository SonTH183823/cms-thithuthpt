<template>
  <el-dialog
    title="Cấu hình SEO"
    :visible.sync="dialog"
    :close-on-click-modal=false
    :before-close="handleCancel"
    ref="dialog"
    dialogid="quick-add"
    @parrent-callback="parrentCallBack"
    width="60%"
  >
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :xl="12" :lg="12">
            <el-form-item class="banner-attri" label="Tiêu đề" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Hình ảnh cover" prop="imgCover">
              <file-pond
                ref="pond"
                allow-image-preview="true"
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
        <el-form-item>
          <div style="display: flex; width: 100%; flex-direction: row; justify-content: space-between">
            <el-button type="danger" @click="centerDialogVisible = true">Xóa SEO</el-button>
            <div>
              <el-button @click="updateShowDialog(false)">Hủy</el-button>
              <el-button type="primary" @click="handleSubmit">Cập nhật</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-dialog
        title="Thông báo"
        :visible.sync="centerDialogVisible"
        width="20%"
        append-to-body
      >
        <span>Bạn có chắc muốn xóa?</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="handleDel">Xác nhận</el-button>
  </span>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
import config from '@/utils/config'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import vueFilePond, { setOptions } from "vue-filepond"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginImageTransform from "filepond-plugin-image-transform"
import FilePondPluginImageResize from "filepond-plugin-image-resize"
import { validText } from "@/utils/validate"
import MinIOAPI from "@/api/minioApi"
import SeoAPI from "@/api/seoApi"

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
  name: "DialogOwnSEO",
  components: {
    FilePond,
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/prop-name-casing
    IdObject: {
      type: String,
      default: ''
    },
    targetType: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đủ trường'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dialog: this.dialogFormVisible,
      centerDialogVisible: false,
      config,
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
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val) {
        this.checkHasSEO()
      } else {
        this.resetForm()
        this.myFiles = []
      }
      this.dialog = val
    },
    dialog() {
      this.visibleChange()
    },
  },
  methods: {
    async checkHasSEO() {
      this.loading = true
      switch (this.targetType) {
        case 'cateNewsId':
          SeoAPI.hasSEO({
            cateNewsId: this.IdObject
          }).then(res => {
            this.loadFormEditIfHas(res.data)
          })
          break
        case 'newsId':
          SeoAPI.hasSEO({
            newsId: this.IdObject
          }).then(res => {
            this.loadFormEditIfHas(res.data)
          })
          break
        case 'carId':
          SeoAPI.hasSEO({
            carId: this.IdObject
          }).then(res => {
            this.loadFormEditIfHas(res.data)
          })
          break
        case 'recruitId':
          SeoAPI.hasSEO({
            recruitId: this.IdObject,
          }).then(res => {
            this.loadFormEditIfHas(res.data)
          })
          break
        default:
          this.loading = false
          break
      }
    },
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      this.loading = false
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    async loadFormEditIfHas(data) {
      if (data.length === 0) {
        this.formType = 'create'
        this.loading = false
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
    async handleDel() {
      if (this.form._id) {
        await SeoAPI.delete(this.form._id)
      }
      this.resetForm()
      this.centerDialogVisible = false
      this.dialog = false
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
              rank: this.form.rank,
              type: 2,
              target: {},
              active: 1
            }
            switch (this.targetType) {
              case 'cateNewsId':
                data.target = {
                  cateNewsId: this.IdObject
                }
                break
              case 'newsId':
                data.target = {
                  newsId: this.IdObject
                }
                break
              case 'carId':
                data.target = {
                  carId: this.IdObject
                }
                break
              case 'recruitId':
                data.target = {
                  recruitId: this.IdObject
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
            this.dialog = false
          } else {
            console.log('Error Submit!')
            return false
          }
        }
      )
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
    updateShowDialog(visibility) {
      this.resetForm()
      this.dialog = visibility
    },
    async parrentCallBack(action, data) {
      this.$emit("update-visiable-seo", {
        action: action,
        data,
      })
    },
    onRemoveFile() {
      this.form.imgCover = undefined
      this.myFiles = []
    },
    visibleChange() {
      this.parrentCallBack("visibility", {
        visible: this.dialog,
      })
    },
    handleCancel() {
      this.dialog = false
      this.resetForm()
    },
  }
}
</script>

