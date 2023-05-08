<template>
  <div v-loading="loadingBanner" class="news-form-container">
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
          <el-col :xl="12" :md="12">

            <el-form-item label="Tên button" prop="button">
              <el-input v-model="formSubmit.button"></el-input>
            </el-form-item>
            <el-form-item label="Tiêu đề" prop="title">
              <el-input v-model="formSubmit.title"></el-input>
            </el-form-item>
            <el-form-item label="Thứ tự" prop="rank">
              <!--              <el-input v-model="formSubmit.rank"></el-input>-->
              <el-input-number v-model="formSubmit.rank" :min="1" placeholder="Nhập số" style="width: 100%"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="Link" prop="link_url">
              <el-input v-model="formSubmit.link_url"></el-input>
            </el-form-item>
            <el-form-item
              label="Màn hình"
              label-width="150px"
              prop="screen"
            >
              <el-select v-model="formSubmit.screen" placeholder="Chọn màn hình hiển thị" disabled>
                <el-option
                  v-for="item in config.listScreens"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="Vị trí"
              label-width="150px"
              prop="position"
            >
              <el-select v-model="formSubmit.position" placeholder="Chọn màn hình hiển thị" disabled>
                <el-option
                  v-for="item in listPosition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :md="12">
            <el-form-item class="banner-attri" label="Hình ảnh" prop="image_url">
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
            <el-form-item class="banner-attri" label="Hình ảnh Mobile" prop="imageMobile">
              <file-pond
                className="file-pond1"
                ref="pond"
                name="file"
                label-idle="Tải lên ảnh"
                accepted-file-types="image/*"
                label-file-type-not-allowed="Không đúng định dạng ảnh!"
                :files="myFilesMobile"
                :server="serverMobile"
                credits="false"
                instantUpload="true"
                :onremovefile="onRemoveFileMobile"
              />
            </el-form-item>

            <el-form-item label="Nội dung" prop="description">
              <el-input v-model="formSubmit.description" type="textarea" :autosize="{minRows: 2}"></el-input>
            </el-form-item>

            <el-form-item label="Ghi chú" prop="note">
              <el-input v-model="formSubmit.note" type="textarea" :autosize="{minRows: 2}"></el-input>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row :gutter="20" style="width: 100%; margin-bottom: 50px">
          <h3 style="font-weight: bold; color: #0A9F46; margin-left: 5px">Cài đặt thời gian</h3>
          <el-col :xl="6" :md="6">
            <el-form-item label="Khoảng thời gian" prop="dateRange">
              <el-date-picker
                style="width: 100%"
                v-model="dateRange"
                :picker-options="pickerOptions"
                type="daterange"
                range-separator="to"
                start-placeholder="Ngày bắt đầu"
                end-placeholder="Ngày kết thúc"
              >
              </el-date-picker>
              <div v-if="!dateRange && mesDateError" style="color: #EF4444; font-size: 12px">{{ mesDateError }}</div>
            </el-form-item>
          </el-col>

          <el-col :xl="6" :md="6">
            <el-form-item label="Khoảng thời gian trong ngày" prop="timeRange">
              <el-time-picker
                style="width: 100%"
                is-range
                v-model="timeRange"
                range-separator="to"
                start-placeholder="Thời gian bắt đầu"
                end-placeholder="Thời gian kết thúc"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :md="12">
            <el-form-item
              label="Ngày trong tuần"
              prop="dayInWeek"
            >
              <el-select v-model="formSubmit.dayInWeek" placeholder="Chọn các ngày trong tuần" multiple clearable>
                <el-option
                  v-for="(item, index) in listDay"
                  :key="index"
                  :label="item"
                  :value="index"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </el-row>
  </div>
</template>

<script>
import config from "@/utils/config"
import tableDataBanner from "@/views/manageBanner/tableData"
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
    const validateDayInWeek = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('Vui lòng chọn ngày trong tuần!'))
      } else {
        callback()
      }
    }
    return {
      tableDataBanner,
      screen: Math.floor(this.$router.currentRoute.query.screen),
      position: Math.floor(this.$router.currentRoute.query.position),
      title: '',
      myFiles: [],
      myFilesMobile: [],
      mesDateError: '',
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.formSubmit.image_url = data.path
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
            this.formSubmit.imageMobile = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      config,
      listPosition: [
        {
          value: 1,
          label: 'Trên'
        },
        {
          value: 2,
          label: 'Giữa'
        },
        {
          value: 3,
          label: 'Dưới'
        },
      ],
      formSubmit: {
        image_url: '',
        imageMobile: '',
        description: '',
        active: 1,
        position: '',
        screen: '',
        title: '',
        rank: '',
        link_url: '',
        note: '',
        button: '',
        dayInWeek: [],
        timeStart: undefined,
        timeEnd: undefined,
        dayStart: undefined,
        dayEnd: undefined
      },
      formRules: {
        image_url: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng cập nhật hình ảnh!',
          validator: validateText
        }],
        link_url: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập link!',
            validator: validateText
          }
        ],
        rank: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập thứ tự!',
            validator: validateText
          }
        ],
        timeRange: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng chọn thời gian',
            validator: validateText
          }
        ],
        dateRange: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng chọn ngày',
            validator: validateText
          }
        ],
        dayInWeek: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng chọn ngày trong tuần',
            validator: validateDayInWeek
          }
        ],
      },
      formType: '',
      BannerId: this.$route.params.id,
      listDay: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
      loadingBanner: false,
      timeRange: [new Date(2022, 8, 18, 0, 0, 0), new Date(2022, 8, 18, 23, 59, 59)],
      pickerOptions: {
        disabledDate(time) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          return time.getTime() < yesterday
        },
      },
      dateRange: ''
    }
  },
  mounted() {
    this.formSubmit.screen = Math.floor(this.screen)
    this.formSubmit.position = Math.floor(this.position)
    if (this.BannerId !== '0') {
      this.title = "Cập nhật thông tin Banner"
      this.formType = 'edit'
      this.loadFormEdit()
    } else {
      this.title = "Tạo mới Banner"
      this.formType = 'create'
    }
  },
  methods: {
    onRemoveFile() {
      this.formSubmit.image_url = ''
      this.myFiles = []
    },
    onRemoveFileMobile() {
      this.formSubmit.imageMobile = ''
      this.myFilesMobile = []
    },
    beforeSubmit() {
      if (this.dateRange) {
        this.formSubmit.dayStart = Math.floor(this.dateRange[0] / 1000)
        this.formSubmit.dayEnd = Math.floor(this.dateRange[1] / 1000)
      }
      if (this.timeRange) {
        this.formSubmit.timeStart = this.timeRange[0].getHours() * 60 + this.timeRange[0].getMinutes()
        this.formSubmit.timeEnd = this.timeRange[1].getHours() * 60 + this.timeRange[1].getMinutes()
      }
    },
    loadTimeEdit(data) {
      const timeStart = {
        hour: Math.floor(data.timeStart / 60),
        minute: Math.floor(data.timeStart % 60)
      }
      const timeEnd = {
        hour: Math.floor(data.timeEnd / 60),
        minute: Math.floor(data.timeEnd % 60)
      }
      this.timeRange = [new Date(2022, 8, 18, timeStart.hour, timeStart.minute, 0), new Date(2022, 8, 18, timeEnd.hour, timeEnd.minute, 59)]
      if (data.dayStart) {
        this.dateRange = [data.dayStart * 1000, data.dayEnd * 1000]
      }
    },
    async loadFormEdit() {
      try {
        this.loadingBanner = true
        const data = await BannerAPI.getById(this.BannerId)
        this.formSubmit = { ...data }
        this.loadTimeEdit(data)
        this.loadingBanner = false
        if (this.formSubmit.image_url) {
          this.myFiles = [await this.getImageFilePreview(this.formSubmit.image_url)]
        }
        if (this.formSubmit.imageMobile) {
          this.myFilesMobile = [await this.getImageFilePreview(this.formSubmit.imageMobile)]
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
        image_url: '',
        description: '',
        active: 1,
        title: '',
        rank: '',
        link_url: '',
        note: '',
        button: '',
        position: this.position,
        screen: this.screen,
        dayInWeek: [],
        timeStart: undefined,
        timeEnd: undefined,
        dayStart: undefined,
        dayEnd: undefined
      }
    },
    async handelSend() {
      await this.$refs.formSubmit.validate(async valid => {
        if (!this.dateRange) {
          this.mesDateError = 'Vui lòng chọn ngày bắt đầu và kết thúc!'
          valid = false
        } else {
          this.mesDateError = ''
        }
        if (valid) {
          this.beforeSubmit()
          try {
            this.loadingBanner = true
            if (this.formType === 'create') {
              await BannerAPI.create(this.formSubmit)
            } else {
              await BannerAPI.update(this.formSubmit, this.BannerId)
            }
            this.loadingBanner = false
          } catch (err) {
            this.loadingBanner = false
          }
          this.refreshForm()
          this.$router.push({
            path: '/quan-ly-banner/danh-sach-banner',
            query: { screen: this.screen, position: this.position }
          })
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push({
        path: '/quan-ly-banner/danh-sach-banner',
        query: { screen: this.screen, position: this.position }
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
