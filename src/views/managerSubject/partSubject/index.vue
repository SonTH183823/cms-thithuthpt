<template>
  <div class="app-container">
    <el-dialog
      :title="formType === 'create' ? 'Thêm đánh giá mới' : 'Chỉnh sửa đánh giá'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal=false
      :before-close="handleCancel"
      top="50px"
      width="60%"
    >
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :xl="12" :lg="12">
            <el-form-item sortable class="banner-attri" label="Kích hoạt" prop="active">
              <el-switch v-model="form.active" :active-value="1" :inactive-value="0" active-color="#13ce66"
                         style="margin-right: 10px;"
              />
            </el-form-item>
            <el-form-item class="banner-attri" label="Tên" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Hình đại diện" prop="avatar">
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
            <el-form-item class="banner-attri" label="Đánh giá (sao)" prop="star">
              <el-input-number v-model="form.star" :precision="1" :step="0.1" :max="5" :min="0"></el-input-number>
            </el-form-item>
            <!--            <el-form-item class="banner-attri" label="Màn hình" prop="screen">-->
            <!--              <el-select v-model="form.fromScreen" placeholder="Chọn màn hình">-->
            <!--                <el-option-->
            <!--                  v-for="(item, index) in listScreens"-->
            <!--                  :key="index"-->
            <!--                  :label="item"-->
            <!--                  :value="index + 1"-->
            <!--                >-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item class="banner-attri" label="Bình luận" prop="comment">
              <el-input type="textarea" :rows="15" v-model="form.comment"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="width: 100%; display: flex; justify-content: flex-end">
                <el-button @click="handleCancel">Hủy</el-button>
                <el-button type="primary" @click="handleSubmit">{{ formType === 'create' ? 'Thêm mới' : 'Chỉnh sửa' }}
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
          Thêm đánh giá mới
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
          <el-table-column label="Hình đại diện" prop="avatar" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.avatar"
                style="width:80px; height: auto"
                :src="`${scope.row.avatar.includes('http') ? scope.row.avatar : `${config.api.domainUpload}/${scope.row.avatar}`}`"
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
import RatingAPI from "@/api/ratingApi"
import { validText } from "@/utils/validate"
import { handleSearchInTable } from "@/utils"
import vueFilePond, { setOptions } from "vue-filepond"
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginImageTransform from "filepond-plugin-image-transform"
import FilePondPluginImageResize from "filepond-plugin-image-resize"
import MinIOAPI from '@/api/minioApi'
import UploadAPI from "@/api/uploadApi"

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
      url: config.api.subject,
      config,
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await UploadAPI.uploadFile(file)
            this.form.avatar = data.filename
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      columnsMap: [
        // {
        //   label: 'Màn hình',
        //   prop: 'fromScreen',
        //   type: 'config',
        //   minWidth: '90',
        //   propConfig: 'fromStatistical'
        // },
        {
          label: 'Đánh giá (sao)',
          prop: 'star',
          minWidth: '100',
        },
        {
          label: 'Bình luận',
          prop: 'comment',
          minWidth: '250',
        },
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '80',
        },
      ],
      listScreens: ['Trang chủ', 'Trang bán xe', 'Trang Chứng chỉ chất lượng'],
      form: {
        name: '',
        avatar: '',
        fromScreen: 1,
        comment: '',
        active: 1,
        star: 5,
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: validateText }],
        star: [{ required: true, trigger: 'blur', validator: validateText }],
        avatar: [{ required: true, trigger: 'blur', validator: validateText }],
        comment: [{ required: true, trigger: 'blur', validator: validateText }],
        fromScreen: [{ required: true, trigger: 'blur', validator: validateText }],
      },
      dialogFormVisible: false,
      formType: '',
      imgFile: [],
    }
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async handleEdit(prams) {
      this.formType = 'edit'
      this.form = { ...prams }
      this.dialogFormVisible = true
    },
    async handleDelete(prams) {
      try {
        await RatingAPI.delete(prams._id)
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
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.formType === 'create') {
            await RatingAPI.create(this.form)
            this.$refs.tableData.refreshData()
            this.refreshData()
          } else {
            await RatingAPI.update(this.form._id, this.form)
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
      this.form.avatar = undefined
      this.imgFile = []
    },
    refreshData() {
      this.form = {
        name: '',
        avatar: '',
        fromScreen: 1,
        active: 1,
        star: 5,
        comment: '',
      }
      this.imgFile = []
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

