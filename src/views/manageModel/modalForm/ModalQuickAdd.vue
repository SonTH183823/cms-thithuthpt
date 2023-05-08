<template>
  <el-dialog
    :title="`Thêm nhanh ` + titleForm + ` mới`"
    :visible.sync="dialog"
    :close-on-click-modal=false
    ref="dialog"
    dialogid="quick-add"
    @parrent-callback="parrentCallBack"
    width="40%"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
      <el-form-item class="banner-attri" :label="`Tên ${this.titleForm}`" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <!--      hãng xe và dáng xe-->
      <el-form-item v-if="typeProperties === 1 || typeProperties === 4" class="banner-attri" label="Hình ảnh"
                    prop="logo"
      >
        <file-pond
          className="file-pond1"
          ref="pond"
          name="file"
          label-idle="Tải lên ảnh"
          allow-multiple="false"
          allow-remove="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="myFiles"
          :server="server"
          credits="false"
          instantUpload="true"
          :onremovefile="onRemoveFile"
        />
      </el-form-item>
      <el-form-item v-if="typeProperties === 3" class="banner-attri" label="Mã màu" prop="colorCode">
        <div style="display: flex; flex-direction: row">
          <el-input v-model="form.colorCode" readonly style="margin-right: 10px"></el-input>
          <el-color-picker v-model="form.colorCode"></el-color-picker>
        </div>
      </el-form-item>

      <el-form-item class="banner-attri" label="Ghi chú" prop="note">
        <el-input v-model="form.note"></el-input>
      </el-form-item>
      <el-form-item sortable class="banner-attri" label="Kích hoạt">
        <el-switch v-model="form.active" :active-value="1" :inactive-value="0" active-color="#13ce66"
                   style="margin-right: 10px;"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="updateShowDialog(false)">Hủy</el-button>
        <el-button type="primary" @click="handleSubmit">Thêm mới</el-button>
      </el-form-item>
    </el-form>
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
import ManufacturerAPI from "@/api/properties/manufacturerApi"
import BrandAPI from "@/api/properties/brandApi"
import ColorAPI from "@/api/properties/colorApi"
import FigureAPI from "@/api/properties/figureApi"
import FuelAPI from "@/api/properties/fuelApi"
import DriveAPI from "@/api/properties/driveApi"
import OriginAPI from "@/api/properties/originApi"
import GearAPI from "@/api/properties/gearApi"
import MinIOAPI from "@/api/minioApi"

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

/*
* Hãng xe - manufacturer - 1
* Dòng xe - brand - 2
* Màu xe - color - 3
* Dáng xe - figure - 4
* Nhiên liệu - fuel - 5
* dẫn động - drive - 6
* hộp số - gear - 8
* xuất xứ - origin - 7
* */

export default {
  name: "ModalQuickAdd",
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    typeProperties: {
      type: Number,
      default: null
    },
    manufacturerId: {
      type: String,
      default: ''
    },
  },
  components: {
    FilePond,
  },
  watch: {
    dialogFormVisible(val) {
      this.dialog = val
    },
    dialog() {
      this.visibleChange()
    },
    typeProperties(val) {
      this.setUpData(val)
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
      dialog: this.dialogFormVisible,
      url: `${config.api.domainCar}/manufacturer`,
      config,
      listCarCompany: [],
      myFiles: [],
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.form.logo = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      urlUploadFile: `${config.api.domainUpload}\\uploads`,
      tableData: [],
      imgSrc: '',
      titleForm: '',
      form: {
        logo: '',
        name: '',
        note: '',
        manufacturer: '',
        colorCode: '#FFF',
        active: 1
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: validateText }],
        manufacturer: [{ required: true, trigger: 'blur', validator: validateText }],
        logo: [{ required: true, trigger: 'blur', message: 'Yêu cầu tải ảnh lên' }],
        active: [{ required: true, trigger: 'blur', validator: validateText }],
        colorCode: [{ required: true, trigger: 'blur', message: 'Yêu cầu chọn mã màu' }],
      },
    }
  },
  mounted() {
    this.setUpData(this.typeProperties)
  },
  methods: {
    async getManufacturer() {
      const res = await ManufacturerAPI.get()
      this.listCarCompany = res.data
    },
    setUpData(val) {
      switch (val) {
        case config.specType.manufacturer: {
          this.titleForm = 'hãng xe'
          break
        }
        case config.specType.brand: {
          this.titleForm = 'dòng xe'
          this.getManufacturer()
          break
        }
        case config.specType.color: {
          this.titleForm = 'màu xe'
          break
        }
        case config.specType.figure: {
          this.titleForm = 'kiểu dáng xe'
          break
        }
        case config.specType.fuel: {
          this.titleForm = 'loại nhiên liệu'
          break
        }
        case config.specType.drive: {
          this.titleForm = 'kiểu dẫn động'
          break
        }
        case config.specType.origin: {
          this.titleForm = 'xuất xứ'
          break
        }
        case config.specType.gear: {
          this.titleForm = 'kiểu hộp số'
          break
        }
      }
    },
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          switch (this.typeProperties) {
            case config.specType.manufacturer: {
              const data = {
                name: this.form.name,
                logo: this.form.logo,
                note: this.form.note,
                active: this.form.active
              }
              const res = await ManufacturerAPI.create(data)
              this.$emit('createData', {
                type: config.specType.manufacturer,
                data: res
              })
              this.resetForm()
              this.dialog = false
              break
            }
            case config.specType.brand: {
              const data = {
                name: this.form.name,
                manufacturer: this.manufacturerId,
                note: this.form.note,
                active: this.form.active,
              }
              const res = await BrandAPI.create(data)
              this.$emit('createData', {
                type: config.specType.brand,
                data: res
              })
              this.resetForm()
              this.dialog = false
              break
            }
            case config.specType.color: {
              const data = {
                color: this.form.name,
                colorCode: this.form.colorCode,
                note: this.form.note,
                active: this.form.active
              }
              const res = await ColorAPI.create(data)
              this.$emit('createData', {
                type: config.specType.color,
                data: res
              })
              this.resetForm()
              this.dialog = false
              break
            }
            case config.specType.figure: {
              const data = {
                name: this.form.name,
                img: this.form.logo,
                note: this.form.note,
                active: this.form.active
              }
              const res = await FigureAPI.create(data)
              this.$emit('createData', {
                type: config.specType.figure,
                data: res
              })
              this.resetForm()
              this.dialog = false
              break
            }
            case config.specType.fuel: {
              const data = {
                type: this.form.name,
                note: this.form.note,
                active: this.form.active
              }
              const res = await FuelAPI.create(data)
              this.$emit('createData', {
                type: config.specType.fuel,
                data: res
              })
              this.resetForm()
              this.dialog = false
              break
            }
            case config.specType.drive: {
              const data = {
                name: this.form.name,
                note: this.form.note,
                active: this.form.active
              }
              const res = await DriveAPI.create(data)
              this.$emit('createData', {
                type: config.specType.drive,
                data: res
              })
              this.resetForm()
              this.dialog = false
              break
            }
            case config.specType.origin: {
              const data = {
                source: this.form.name,
                note: this.form.note,
                active: this.form.active
              }
              const res = await OriginAPI.create(data)
              this.$emit('createData', {
                type: config.specType.origin,
                data: res
              })
              this.resetForm()
              this.dialog = false
              break
            }
            case config.specType.gear: {
              const data = {
                name: this.form.name,
                note: this.form.note,
                active: this.form.active
              }
              const res = await GearAPI.create(data)
              this.$emit('createData', {
                type: config.specType.gear,
                data: res
              })
              this.resetForm()
              this.dialog = false
              break
            }
          }
          this.myFiles = []
          this.imgSrc = ''
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },

    resetForm() {
      this.form = {
        logo: '',
        name: '',
        note: '',
        colorCode: '#FFF',
        active: 1
      }
    },
    updateShowDialog(visibility) {
      this.resetForm()
      this.dialog = visibility
    },
    async parrentCallBack(action, data) {
      this.$emit("update-visiable", {
        action: action,
        data,
      })
    },
    onRemoveFile() {
      this.form.logo = undefined
      this.myFiles = []
    },
    visibleChange() {
      this.parrentCallBack("visibility", {
        visible: this.dialog,
        typeProp: this.typeProperties
      })
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.form = {}
      this.imgSrc = {}
      this.logo = {}
      this.myFiles = []
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

<style scoped>
.file-pond1 {
  width: 100% !important;
}
</style>
