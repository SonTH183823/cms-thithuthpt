<template>
  <div class="app-container">
    <el-dialog
      :title="formType === 'create' ? 'Thêm chuyên đề mới' : 'Chỉnh sửa chuyên đề'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      top="50px"
      width="40%"
    >
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-form-item class="banner-attri" label="Môn học">
          <el-input disabled :value="tableDataSubject(subject).label"></el-input>
        </el-form-item>
        <el-form-item class="banner-attri" label="Tên" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item class="banner-attri" label="Hình thumbnail" prop="thumbnail">
          <div v-if="form.thumbnail">
            <img
              alt=""
              style="width:500px; height: auto; margin-bottom: 10px"
              :src="`${form.thumbnail.includes('http') ? form.thumbnail : `${config.api.domainUpload}/${form.thumbnail}`}`"
            />
          </div>
          <file-pond
            ref="pond"
            allow-image-preview="false"
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
        <el-form-item>
          <div style="width: 100%; display: flex; justify-content: flex-end">
            <el-button @click="handleCancel">Hủy</el-button>
            <el-button type="primary" @click="handleSubmit">{{ formType === 'create' ? 'Thêm mới' : 'Chỉnh sửa' }}
            </el-button>
          </div>
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
          @click="handleBack"
          plain
        >
          <i class="el-icon-back" style="margin-right: 10px"/>
          Quay lại
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          Thêm chuyên đề mới
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
          <el-table-column label="Tên" prop="name" align="center" min-width="80"></el-table-column>
          <el-table-column label="Môn học" prop="subject" align="center" min-width="80">
            <template slot-scope="scope">
              <div>{{ tableDataSubject(subject).label }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Thumbnail" prop="thumbnail" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.thumbnail"
                alt=""
                style="width:80px; height: auto"
                :src="`${scope.row.thumbnail.includes('http') ? scope.row.thumbnail : `${config.api.domainUpload}/${scope.row.thumbnail}`}`"
              />
            </template>
          </el-table-column>
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
import SearchColumn from "@/components/SearchColumn"
import PartSubjectAPI from "@/api/partSubjectApi"
import {validText} from "@/utils/validate"
import {handleSearchInTable} from "@/utils"
import vueFilePond, {setOptions} from "vue-filepond"
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginImageTransform from "filepond-plugin-image-transform"
import FilePondPluginImageResize from "filepond-plugin-image-resize"
import UploadAPI from "@/api/uploadApi"
import tableDataSubject from "@/views/managerSubject/tableData"

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
moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn,
    FilePond,
    // eslint-disable-next-line vue/no-unused-components
    tableDataSubject
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
      url: `${config.api.subject}?subject=${this.$router.currentRoute.query.subject}`,
      config,
      server: {
        process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await UploadAPI.uploadFile(file)
            this.form.thumbnail = data.filename
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      subject: this.$router.currentRoute.query.subject,
      columnsMap: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '80',
        },
      ],
      form: {
        name: '',
        thumbnail: '',
        subject: this.$router.currentRoute.query.subject,
        active: 1
      },
      formRules: {
        name: [{required: true, trigger: 'blur', validator: validateText}],
        thumbnail: [{required: true, trigger: 'blur', validator: validateText}],
      },
      dialogFormVisible: false,
      formType: '',
      imgFile: [],
    }
  },
  methods: {
    tableDataSubject(index) {
      return tableDataSubject[index - 1]
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async handleEdit(prams) {
      this.formType = 'edit'
      this.form = {...prams}
      this.dialogFormVisible = true
    },
    async handleDelete(prams) {
      try {
        await PartSubjectAPI.delete(prams._id)
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        console.log(err)
      }
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.refreshData()
    },
    handleAdd() {
      this.formType = 'create'
      this.dialogFormVisible = true
    },
    handleBack() {
      this.$router.back()
    },
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.formType === 'create') {
            await PartSubjectAPI.create(this.form)
            this.$refs.tableData.refreshData()
            this.refreshData()
          } else {
            await PartSubjectAPI.update(this.form._id, this.form)
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
    onRemoveFile() {
      this.form.thumbnail = undefined
      this.imgFile = []
    },
    refreshData() {
      this.form = {
        name: '',
        subject: this.subject,
        thumbnail: ''
      }
      this.imgFile = []
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

