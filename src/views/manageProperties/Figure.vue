<template>
  <div class="app-container">
    <el-dialog
      :title="formType ==='create' ? 'Thêm dáng xe mới' : 'Chỉnh sửa dáng xe'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="60%"
    >
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-form-item class="banner-attri" label="Tên kiểu dáng xe" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item class="banner-attri" label="Hình ảnh đại diện" prop="img">
          <file-pond
            ref="pond"
            allow-image-preview="true"
            class-name="file-pond1"
            name="file"
            label-idle="Tải lên ảnh"
            allow-remove="true"
            accepted-file-types="image/*"
            label-file-type-not-allowed="Không đúng định dạng ảnh"
            :files="figureFile"
            :server="server"
            credits="false"
            instant-upload="true"
            :onremovefile="onRemoveFile"
          />
        </el-form-item>
        <el-form-item class="banner-attri" label="Ghi chú" prop="note">
          <el-input v-model="form.note"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          Thêm dáng xe mới
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          border
          :data="scope.tableData"
          style="width: 100%; font-size: 0.8rem; overflow: auto;"
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="STT"
            align="center"
            fixed="left"
            :index="indexMethod"
          />
          <el-table-column label="Tên kiểu dáng xe" prop="name" align="center" min-width="120"/>
          <el-table-column label="Hình ảnh đại diện" prop="img" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.img"
                style="width:80px; height: auto"
                :src="`${config.api.domainUpload}/${scope.row.img}`"
              >
            </template>
          </el-table-column>
          <el-table-column label="Ghi chú" prop="note" align="center" min-width="150"/>
          <el-table-column
            align="center"
            label="Tác vụ"
            width="180"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-tooltip content="Sửa" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handleEdit(scope.row)"
                >
                  <i class="el-icon-edit"/>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Xóa" placement="top">
                <el-popconfirm
                  style="margin-left: 5px"
                  confirm-button-text="Đồng ý"
                  cancel-button-text="Hủy"
                  title="Bạn có chắc chắn xóa?"
                  @onConfirm="handleDelete(scope.row)"
                >
                  <el-button
                    slot="reference"
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                  />
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-pagination>
  </div>
</template>

<script>
import config from '@/utils/config'
import FigureAPI from "@/api/properties/figureApi"
import moment from 'moment'
import { validText } from "@/utils/validate"
import TablePagination from "@/components/TablePagination"
import vueFilePond, { setOptions } from "vue-filepond"
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginImageTransform from "filepond-plugin-image-transform"
import FilePondPluginImageResize from "filepond-plugin-image-resize"
import MinIOAPI from '@/api/minioApi'

moment.locale('vi')
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
  name: "Figure",
  components: {
    TablePagination,
    FilePond
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
      pickerOptions2: {},
      url: `${config.api.domainCar}/figure`,
      config,
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.form.img = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      loading: false,
      options: [],
      form: {
        img: '',
        name: '',
        note: '',
        active: 1
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: validateText }],
        img: [{ required: true, trigger: 'blur', message: 'Yêu cầu tải ảnh lên' }],
      },
      formType: '',
      dialogFormVisible: false,
      figureFile: []
    }
  },
  methods: {
    handleAdd() {
      this.formType = 'create'
      this.dialogFormVisible = true
      this.form = {
        note: '',
        img: '',
        name: '',
        active: 1
      }
    },
    async handleEdit(prams) {
      this.formType = 'edit'
      this.form = {
        _id: prams._id,
        name: prams.name,
        note: prams.note,
        img: prams.img,
        active: prams.active
      }
      if (prams.img) {
        this.figureFile = [await this.getFigureFilePreview(prams.img)]
      }
      this.dialogFormVisible = true
    },
    async getFigureFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    async handleDelete(prams) {
      try {
        this.loading = true
        await FigureAPI.delete(prams._id)
        this.loading = false
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        this.loading = false
      }
    },
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          switch (this.formType) {
            case 'create':
              await FigureAPI.create({
                ...this.form,
              })
              this.$refs.tableData.refreshData()
              this.form = {}
              this.dialogFormVisible = false
              break
            case 'edit':
              // eslint-disable-next-line no-case-declarations
              const dataSubmit = {
                ...this.form,
              }
              delete dataSubmit._id
              await FigureAPI.update(this.form._id, dataSubmit)
              this.$refs.tableData.refreshData('edit')
              this.form = {}
              this.dialogFormVisible = false
              break
          }
          this.form = {}
          this.figureFile = []
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.form = {}
      this.figureFile = []
    },
    onRemoveFile() {
      this.form.img = undefined
      this.myFiles = []
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

<style>
.file-pond1 {
  width: 100% !important;
}

</style>
