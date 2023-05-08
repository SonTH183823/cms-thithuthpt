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
        <el-row :gutter="20" style="width: 100%">
          <el-col :xl="12" :md="12">
            <el-form-item label="Tiêu đề" prop="notification.title">
              <el-input v-model="formSubmit.notification.title"></el-input>
            </el-form-item>
            <el-form-item label="Nội dung" prop="notification.body">
              <el-input v-model="formSubmit.notification.body" type="textarea" :autosize="{ minRows: 5}"></el-input>
            </el-form-item>
            <!--            <el-form-item label="Kiểu" prop="timeConfig.type">-->
            <!--              <el-select v-model="formSubmit.timeConfig.type" placeholder="Chọn kiểu">-->
            <!--                <el-option-->
            <!--                  v-for="item in typeTime"-->
            <!--                  :key="item.value"-->
            <!--                  :label="item.label"-->
            <!--                  :value="item.value"-->
            <!--                >-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item label="Thời gian bắt đầu" prop="timeConfig.timeStart">
              <el-date-picker
                v-model="formSubmit.timeConfig.timeStart"
                :picker-options="pickerOptions"
                style="width: 100%"
                type="datetime"
                placeholder="Select date and time"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :md="12">
            <el-form-item label="Link direct" prop="direct">
              <el-input v-model="formSubmit.direct"></el-input>
            </el-form-item>
            <el-form-item label="Tab" prop="tab">
              <el-select v-model="formSubmit.tab" placeholder="Chọn tab">
                <el-option
                  v-for="item in listTabs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Thiết bị" prop="deviceTarget">
              <el-select v-model="formSubmit.deviceTarget" placeholder="Chọn thiết bị" multiple>
                <el-option
                  v-for="item in config.deviceTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="banner-attri" label="Hình ảnh cover" prop="imgCover">
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
                :onremovefile="onRemoveFile"
              />
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
import NotificationAPI from "@/api/notificationApi"
import MinIOAPI from "@/api/minioApi"
import moment from "moment"

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
    const validateArray = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('Vui lòng chọn thiết bị'))
      } else {
        callback()
      }
    }
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return {
      title: '',
      myFiles: [],
      mesDateError: '',
      listTabs: [
        {
          value: 1,
          label: 'NEW TAB'
        },
        {
          value: 2,
          label: 'CURRENT TAB'
        }
      ],
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.formSubmit.imgCover = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      config,
      formSubmit: {
        target: 1,
        notification: {
          title: '',
          body: ''
        },
        deviceTarget: [],
        imgCover: '',
        timeConfig: {
          type: 1,
          timeStart: date
        },
        direct: '',
        tab: 1,
      },
      typeTime: [
        {
          label: 'Một lần',
          value: 1
        }
      ],
      formRules: {
        imgCover: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng cập nhật hình ảnh!',
        }],
        direct: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng cập nhật link direct!',
        }],
        tab: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn loại tab!',
        }],
        'notification.title': [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập tiêu đề!',
            validator: validateText
          }
        ],
        'notification.body': [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập nội dung!',
            validator: validateText
          }
        ],
        timeStart: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng chọn thời gian bắt đầu thông báo',
            validator: validateText
          }
        ],
        deviceTarget: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng chọn thiết bị',
            validator: validateArray
          }
        ],
      },
      formType: '',
      NotificationId: this.$route.params.id,
      loading: false,
      pickerOptions: {
        start: '00:00',
        step: '00:10',
        end: '23:59'
      },
    }
  },
  mounted() {
    if (this.NotificationId !== '0') {
      this.title = "Cập nhật thông tin"
      this.formType = 'edit'
      this.loadFormEdit()
    } else {
      this.title = "Tạo mới thông báo"
      this.formType = 'create'
    }
  },
  methods: {
    onRemoveFile() {
      this.formSubmit.imgCover = undefined
      this.myFiles = []
    },
    async loadFormEdit() {
      try {
        this.loading = true
        const data = await NotificationAPI.getById(this.NotificationId)
        this.formSubmit = {
          notification: { ...data.notification },
          imgCover: data.imgCover || '',
          deviceTarget: data.deviceTarget || [],
          timeConfig: { ...data.timeConfig },
          direct: data.direct,
          tab: data.tab,
          target: 1
        }
        this.formSubmit.timeConfig.timeStart = moment.unix(data.timeConfig.timeStart)
        this.loading = false
        if (this.formSubmit.imgCover) {
          this.myFiles = [await this.getImageFilePreview(this.formSubmit.imgCover)]
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
    async handelSend() {
      await this.$refs.formSubmit.validate(async valid => {
        if (valid) {
          const dataSubmit = {
            ...this.formSubmit,
            deviceTarget: this.formSubmit.deviceTarget,
            timeConfig: {
              type: this.formSubmit.timeConfig.type,
              timeStart: Math.floor(this.formSubmit.timeConfig.timeStart / 1000)
            }
          }
          try {
            this.loading = true
            if (this.formType === 'create') {
              await NotificationAPI.create(dataSubmit)
            } else {
              await NotificationAPI.update(dataSubmit, this.NotificationId)
            }
            this.loading = false
          } catch (err) {
            this.loading = false
          }
          this.handleCancel()
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push('/quan-ly-thong-bao/danh-sach')
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
