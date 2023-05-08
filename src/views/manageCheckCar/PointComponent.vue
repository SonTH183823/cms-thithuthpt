<template>
  <div>
    <div class="one-point">
      <div class="one-row">
        <div style="font-size: 16px; height: fit-content">
          <i
            :class=" onePoint.quality === 2 ? 'el-icon-warning warning' : (onePoint.quality === 3 ? 'el-icon-question' : 'el-icon-success success') "
          />
          {{ ' ' }}{{ points.name || points.point.name || '' }}
        </div>
        <el-radio-group v-model="onePoint.quality">
          <el-radio :label="1" class="radio-success">Đạt</el-radio>
          <el-radio :label="2" class="radio-error warning">Lỗi</el-radio>
          <el-radio :label="3" class="radio-na">Chưa xác định</el-radio>
        </el-radio-group>
      </div>
      <div v-if="onePoint.quality === 2" style="margin-top: 5px; padding-bottom: 10px">
        <div v-if="onePoint.images && onePoint.images.length > 0" class="img-list-grid-one-point">
          <div
            v-for="(item, idx) in onePoint.images"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${item.path}`"
              width="100%"
              height="200px"
              style="object-fit: cover; border-top-left-radius: 5px; border-top-right-radius: 5px"
              alt="Warning image"
            >
            <span class="icon-remove-img" @click="removeImgFormEdit(item.path, idx)">
              <el-icon name="error"/>
            </span>
            <div class="line-clamp-reason"><span style="font-weight: bold">Lý do / vị trí:</span> {{ item.reason }}
            </div>
            <div class="el-row--flex is-justify-center">
              <el-button type="text" @click="editOneImg(idx)">
                Chi tiết
              </el-button>
            </div>
          </div>

          <div class="img-item">
            <img
              src="../../assets/images/image_placeholder.png"
              width="100%"
              height="200px"
              style="object-fit: cover; border-top-left-radius: 5px; border-top-right-radius: 5px"
              alt=""
            >
            <div class="el-row--flex is-justify-center">
              <el-button type="text" @click="addImg()">
                Thêm ảnh lỗi
              </el-button>
            </div>
          </div>

        </div>

      </div>
    </div>
    <el-dialog
      :title="idxPoints ? 'Cập nhật' : 'Thêm ảnh lỗi'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="50%"
    >
      <el-form ref="oneImage" :model="oneImage" :rules="formRules" label-width="60px" label-position="top">
        <el-row :gutter="20">
          <el-col :xl="12" :lg="12">
            <el-form-item label="Ảnh lỗi" prop="path">
              <file-pond
                ref="pond"
                allow-image-preview="true"
                class-name="file-pond1"
                name="file"
                label-idle="Tải lên ảnh"
                allow-remove="true"
                accepted-file-types="image/*"
                label-file-type-not-allowed="Không đúng định dạng ảnh"
                :files="imgFile"
                :server="server"
                credits="false"
                instant-upload="true"
                :onremovefile="onRemoveFile"
              />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :lg="12">
            <el-form-item label="Lý do/Vị trí" prop="reason">
              <el-input
                v-model="oneImage.reason"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 10}"
                placeholder="Nhập lý do hoặc vị trí"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px">
          <el-button size="small" @click="handleCancel">Hủy</el-button>
          <el-button type="primary" size="small" @click="addErrorImg">Xác nhận</el-button>
        </div>
      </el-form>

      <el-dialog
        width="25%"
        title="Thông báo"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div style="margin-bottom: 10px; color: #f56c6c">
          Bắt buộc phải chọn ảnh khi ở trạng thái "lỗi". Tiếp tục nhập?
        </div>
        <el-button size="small" @click="handleFinishCancel">Hủy</el-button>
        <el-button type="primary" size="small" @click="innerVisible = false">Tiếp tục</el-button>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/utils/config"
import vueFilePond, { setOptions } from 'vue-filepond'
import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import MinIOAPI from "@/api/minioApi"

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
  props: {
    points: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      config,
      dialogFormVisible: false,
      innerVisible: false,
      imgFile: [],
      idxPoints: undefined,
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCheck/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.oneImage.path = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      onePoint: {
        _id: '',
        quality: 1,
        images: []
      },
      oneImage: {
        path: '',
        reason: ''
      },
      formRules: {
        path: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn ảnh'
        }],
        reason: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy nhập lý do/ vị trí'
        }],
      }
    }
  },
  watch: {
    'onePoint.quality': {
      handler: function(val) {
        if (val === 2) {
          if (this.onePoint.images.length === 0) {
            this.dialogFormVisible = true
          }
          this.onePoint.quality = 2
        } else {
          this.onePoint.images = []
          this.$emit('point-change', this.onePoint)
        }
      },
      deep: true,
    },
    'onePoint.images': {
      handler: function(val) {
        if (val.length > 0) {
          this.$emit('point-change', this.onePoint)
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.onePoint.images = this.points.images || []
    this.onePoint.quality = this.points.quality || 1
    if (this.points.point && this.points.point._id) {
      this.onePoint._id = this.points.point._id
    } else {
      this.onePoint._id = this.points._id
    }
  },
  methods: {
    removeImgFormEdit(path, index) {
      this.onePoint.images.splice(index, 1)
      if (this.onePoint.images.length === 0) {
        this.onePoint.quality = 1
      }
      this.imgFile = []
    },
    addImg() {
      this.idxPoints = undefined
      this.dialogFormVisible = true
      this.imgFile = []
      this.oneImage = {
        path: '',
        reason: ''
      }
    },

    async editOneImg(idx) {
      this.dialogFormVisible = true
      this.oneImage = { ...this.onePoint.images[idx] }
      this.idxPoints = idx
      if (this.oneImage.path) {
        this.imgFile = [await this.getImageFilePreview(this.oneImage.path)]
      }
    },
    onRemoveFile() {
      this.oneImage.path = undefined
      this.imgFile = []
    },
    handleCancel: function() {
      if (this.onePoint.quality === 2 && this.onePoint.images.length === 0) {
        this.innerVisible = true
      } else {
        this.dialogFormVisible = false
        this.oneImage = {
          path: '',
          reason: ''
        }
        this.imgFile = []
      }
    },
    addErrorImg() {
      this.$refs.oneImage.validate(async valid => {
        if (valid) {
          if (this.idxPoints >= 0) {
            this.onePoint.images.splice(this.idxPoints, 1)
            this.onePoint.images.splice(this.idxPoints, 0, this.oneImage)
            this.idxPoints = undefined
          } else {
            this.onePoint.images.push(this.oneImage)
          }
          this.oneImage = {
            path: '',
            reason: ''
          }
          this.imgFile = []
          this.dialogFormVisible = false
        }
      })
    },
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    handleFinishCancel: function() {
      this.onePoint.quality = 1
      this.innerVisible = false
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss">
.one-point {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: rgba(17, 17, 26, 0.05) 0 4px 16px, rgba(17, 17, 26, 0.05) 0 8px 32px;
}

.one-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.img-list-grid-one-point {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
  grid-gap: 10px;
}

.img-item {
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  border-radius: 5px;
}

.line-clamp-reason {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding: 5px;
}

.radio-error {
  .el-radio__input.is-checked .el-radio__inner {
    background: #ff9900 !important;
    border-color: #ff9900 !important;
  }

  .el-radio__inner:hover {
    border-color: #ff9900 !important;
  }
}

.radio-error .el-radio__input.is-checked + .el-radio__label {
  color: #ff9900 !important;
}

.radio-na {
  .el-radio__input.is-checked .el-radio__inner {
    background: #303133 !important;
    border-color: #303133 !important;
  }

  .el-radio__inner:hover {
    border-color: #303133 !important;
  }
}

.radio-na .el-radio__input.is-checked + .el-radio__label {
  color: #303133 !important;
}

.warning {
  color: #ff9900;
}

.success {
  color: #1BAF21;
}
</style>
