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

            <el-form-item label="Tên Chiến dịch" prop="name">
              <el-input v-model="formSubmit.name"></el-input>
            </el-form-item>
            <el-form-item label="Thời gian bắt đầu" prop="startTime">
              <el-date-picker
                v-model="formSubmit.startTime"
                style="width: 100%"
                type="datetime"
                placeholder="Chọn thời gian bắt đầu"
              />
            </el-form-item>
            <el-form-item label="Thời gian kết thúc" prop="endTime">
              <el-date-picker
                v-model="formSubmit.endTime"
                style="width: 100%"
                type="datetime"
                placeholder="Chọn thời gian kết thúc"
              />
            </el-form-item>
            <el-form-item label="Link" prop="url">
              <el-input v-model="formSubmit.url" type="textarea" :autosize="{minRows: 3}"></el-input>
            </el-form-item>
            <el-form-item label="Mã chiến dịch" prop="campCode">
              <el-input v-model="formSubmit.campCode" placeholder="campCode"></el-input>
            </el-form-item>
            <el-form-item label="Loại chiến dịch" prop="campType">
              <el-input v-model="formSubmit.campType" placeholder="campType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="8">
            <el-form-item label="Hình ảnh" prop="image">
              <div>
                <div v-if="formSubmit.image" style="position: relative">
                  <img :src="`${config.api.domainUpload}/${formSubmit.image}`"
                       style="object-fit: contain; width: 100% ; border-radius: 5px;"
                  >
                  <span class="icon-remove-img" @click="onRemoveFile('image')">
                    <el-icon name="error"/>
                  </span>
                </div>
                <img v-else src="../../../assets/images/image_placeholder.png" style="width: 100%;"
                     @click="addImg('image')"
                >
                <div class="el-row--flex">
                  <el-button type="text" @click="addImg()">Thêm ảnh</el-button>
                </div>
              </div>
            </el-form-item>

          </el-col>
          <el-col :xl="8" :md="8">
            <el-form-item label="Tập khách hàng" prop="type">
              <el-radio-group v-model="formSubmit.type" class="ml-4" style="display: flex; flex-direction: column">
                <el-radio label="1" size="large">Tất cả</el-radio>
                <el-radio label="2" size="large" style="margin-top: 10px">Custom</el-radio>
              </el-radio-group>
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
      <file-pond
        className="file-pond1"
        ref="pond"
        name="file"
        label-idle="Tải lên ảnh"
        accepted-file-types="image/*"
        label-file-type-not-allowed="Không đúng định dạng ảnh!"
        :files="myFiles"
        :server="server"
        credits="false"
        instantUpload="true"
      />
    </el-dialog>
    <el-dialog
      title="Import Excel file"
      :visible.sync="dialogFormVisibleImportEx"
      :close-on-click-modal="false"
      :before-close="handleCancelImport"
      width="40%"
      center
    >
      <a-upload
        name="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :action="`${config.api.userTransaction}/import/sellCar`"
        :headers="header"
        :show-upload-list="false"
        @change="fileListChange"
      >
        <div style="display: flex;flex-direction: row; width: 100%; justify-content: center; align-items: center">
          <a-button
            type="primary"
            style="height: 36px; margin-left: 20px"
          >
            Import Excel file
          </a-button>
          <div v-if="!importError" style="margin-left: 30px; color: black;">{{ resultImportEx }}</div>
          <div v-else style="margin-left: 30px; color: red;">{{ resultImportEx }}</div>
        </div>
      </a-upload>
      <h3
        v-if="tableDataEror.length > 0"
        style=" display: flex; font-weight: bold; width: 100%; align-items: center; justify-content: center; margin-top: 20px; margin-bottom: 10px"
      >
        Những hàng lỗi</h3>
      <el-table
        v-if="tableDataEror.length > 0"
        :data="tableDataEror"
        style="width: 100%;"
        border
        max-height="400px"
      >
        <el-table-column
          type="index"
          label="STT"
          align="center"
          fixed="left"
        />
        <el-table-column
          prop="num"
          label="Dòng"
          align="center"
          width="180"
        />
        <el-table-column
          prop="error"
          align="center"
          label="Lỗi"
        />
      </el-table>
      <div style="display: flex; justify-content: flex-end; width: 100%; margin-top: 20px">
        <a-button @click="handleCancelImport">Xong</a-button>
      </div>
    </el-dialog>
  </div>
</template>```

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
import PopupVETCAPI from "@/api/popupVETC"

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
    const token = localStorage.getItem(config.tokenKey)
    return {
      title: '',
      myFiles: [],
      header: {
        'x-access-token': token,
      },
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
      config,
      typeImage: '',
      formSubmit: {
        image: '',
        name: '',
        active: 1,
        url: '',
        startTime: '',
        endTime: '',
        type: '',

      },
      formRules: {
        image: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng cập nhật hình ảnh!',
          validator: validateText
        }],
        startTime: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng chọn thời gian bắt đầu',
            validator: validateText
          }
        ],
        endTime: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng chọn thời gian kết thúc',
            validator: validateText
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập tên Chiến dịch!',
            validator: validateText
          }
        ],
      },
      formType: '',
      PopupId: this.$route.params.id,
      loading: false,
      dialogImgVisible: false,
      resultImportEx: '',
      dialogFormVisibleImportEx: false,
      tableDataEror: [],
      importError: false,
    }
  },
  watch: {
    // 'formSubmit.type': {
    //   handler: function(val) {
    //     if (val === '2') {
    //       this.openImportDialog()
    //     }
    //   }
    // }
  },
  mounted() {
    if (this.PopupId !== '0') {
      this.title = "Cập nhật thông tin Chiến dịch"
      this.formType = 'edit'
      this.loadFormEdit()
    } else {
      this.title = "Tạo mới Chiến dịch"
      this.formType = 'create'
    }
  },
  methods: {
    onRemoveFile() {
      this.formSubmit.image = ''
      this.myFiles = []
    },
    handleCancelImport() {
      this.tableDataEror = []
      this.dialogFormVisibleImportEx = false
      this.importError = false
    },
    fileListChange({ file }) {
      if (file.status === 'uploading') {
        this.resultImportEx = `Importing ${file.name} ...`
      } else if (file.status === 'error') {
        this.importError = true
        this.resultImportEx = `Importing ${file.name} thất bại!`
      } else if (file.status === 'done') {
        this.tableDataEror = file.response
        if (file.response.length === 0) {
          this.importError = false
          this.resultImportEx = `Import ${file.name} thành công!`
        } else {
          this.importError = true
          this.resultImportEx = `Importing ${file.name} thất bại!`
        }
      }
    },
    openImportDialog() {
      this.resultImportEx = 'Chọn file excel'
      this.dialogFormVisibleImportEx = true
    },
    async addImg() {
      if (this.formSubmit.image) {
        this.myFiles = [await this.getImageFilePreview(this.formSubmit.image)]
      }
      this.dialogImgVisible = true
    },
    async loadFormEdit() {
      try {
        this.loading = true
        const data = await PopupVETCAPI.getById(this.PopupId)
        this.formSubmit = {
          ...data,
          startTime: data.startTime * 1000,
          endTime: data.endTime * 1000
        }
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
        displayTime: 1,
        type: 1
      }
    },
    async handelSend() {
      await this.$refs.formSubmit.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const data = {
              ...this.formSubmit,
              startTime: this.formSubmit.startTime / 1000,
              endTime: this.formSubmit.endTime / 1000
            }
            if (this.formType === 'create') {
              await PopupVETCAPI.create(data)
            } else {
              await PopupVETCAPI.update(data, this.PopupId)
            }
            this.loading = false
          } catch (err) {
            this.loading = false
          }
          this.refreshForm()
          this.$router.push({
            path: '/popup-vetc/danh-sach',
          })
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push({
        path: '/popup-vetc/danh-sach',
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
