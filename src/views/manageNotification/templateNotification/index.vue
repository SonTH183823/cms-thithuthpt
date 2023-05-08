<template>
  <div class="app-container">
    <el-dialog
      :title="formType === 'create' ? 'Thêm template mới' : 'Chỉnh sửa template'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="60%"
    >
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :xl="12" :lg="12">
            <el-form-item class="banner-attri" label="Tiêu đề" prop="title">
              <el-input v-model="form.title" autosize></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Subtitle" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :lg="12">
            <el-form-item class="banner-attri" label="Kiểu" prop="type">
              <el-select v-model="form.type" placeholder="Chọn kiểu">
                <el-option
                  v-for="(item) in config.typeNotificationConfig"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="banner-attri" label="Hình ảnh mặc định" prop="defaultImg">
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
        </el-row>
        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">{{ formType === 'create' ? 'Thêm mới' : 'Chỉnh sửa' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <table-pagination
      ref="tableData"
      :url="url"
      :search-form="searchForm"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          Thêm mới
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
            min-width="50"
            :index="indexMethod"
          />
          <template v-for="column in columnsMap">
            <search-column
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
              :prop-config="column.propConfig"
            />
          </template>
          <el-table-column label="Hình ảnh mặc định" prop="defaultImg" align="center" min-width="200">
            <template slot-scope="scope">
              <img v-if="scope.row.defaultImg"
                   :src="`${config.api.domainUpload}/${scope.row.defaultImg}`"
                   alt="Chưa có ảnh"
                   style="width:80px; height: auto"
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center" label="Tác vụ" width="180" fixed="right"
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
import moment from 'moment'
import TablePagination from "@/components/TablePagination"
import { handleSearchInTable } from "@/utils"
import SearchColumn from "@/components/SearchColumn"
import { validText } from "@/utils/validate"
import NotificationAPI from "@/api/notificationApi"
import MinIOAPI from "@/api/minioApi"
import vueFilePond, { setOptions } from "vue-filepond"
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginImageTransform from "filepond-plugin-image-transform"
import FilePondPluginImageResize from "filepond-plugin-image-resize"

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
  components: {
    TablePagination,
    SearchColumn,
    FilePond
  },
  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đủ trường!'))
      } else {
        callback()
      }
    }
    return {
      url: `${config.api.notificationTemplate}`,
      config,
      searchForm: {},
      imgFile: [],
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.form.defaultImg = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      columnsMap: [
        {
          label: 'Kiểu',
          prop: 'type',
          type: 'config',
          minWidth: '100',
          propConfig: 'typeNotificationConfig'
        },
        {
          label: 'Tiêu đề',
          prop: 'title',
          minWidth: '250',
        },
        {
          label: 'Mô tả',
          prop: 'description',
          minWidth: '300',
        },
      ],
      form: {
        title: '',
        description: '',
        type: 1,
        defaultImg: undefined
      },
      formRules: {
        title: [{ required: true, trigger: 'blur', validator: validateText }],
        description: [{ required: true, trigger: 'blur', validator: validateText }],
        type: [{ required: true, trigger: 'blur', validator: validateText }],
      },
      dialogFormVisible: false,
      formType: '',
    }
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async handleEdit(prams) {
      this.formType = 'edit'
      this.form = { ...prams }
      if (this.form.defaultImg) {
        this.imgFile = [await this.getImageFilePreview(this.form.defaultImg)]
      }
      this.dialogFormVisible = true
    },
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    async handleDelete(prams) {
      try {
        await NotificationAPI.deleteTemplate(prams._id)
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        console.log(err)
      }
    },
    handleCancel() {
      this.refreshData()
      this.dialogFormVisible = false
    },
    handleAdd() {
      this.formType = 'create'
      this.dialogFormVisible = true
    },
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.formType === 'create') {
            await NotificationAPI.createTemplate(this.form)
            this.$refs.tableData.refreshData()
            this.refreshData()
          } else {
            await NotificationAPI.updateTemplate(this.form._id, this.form)
            this.$refs.tableData.refreshData('edit')
            this.refreshData()
          }
          this.dialogFormVisible = false
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    refreshData() {
      this.form = {
        title: '',
        description: '',
        type: 1,
        defaultImg: undefined
      }
      this.imgFile = []
    },
    indexMethod(index) {
      return index + 1
    },
    onRemoveFile() {
      this.form.defaultImg = undefined
      this.imgFile = []
    },
  }
}
</script>

