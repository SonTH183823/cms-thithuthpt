<template>
  <div class="app-container">
    <el-dialog
      :close-on-click-modal=false
      :before-close="handleCancel"
      :title="formType ==='create' ? 'Thêm SEO mới' : 'Chỉnh sửa SEO'"
      :visible.sync="dialogFormVisible"
      width="70%"
      top="5vh"
    >
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :xl="12" :lg="12">
<!--            <el-form-item sortable class="banner-attri" label="Kích hoạt" prop="active">-->
<!--              <el-switch v-model="form.active" :active-value="1" :inactive-value="0" active-color="#13ce66"-->
<!--                         style="margin-right: 10px;"-->
<!--              />-->
<!--              -->
<!--            </el-form-item>-->
<!--            <el-form-item class="banner-attri" label="Thứ tự" prop="rank">-->
<!--              <el-input-number v-model="form.rank" :min="1"></el-input-number>-->
<!--            </el-form-item>-->
            <el-form-item class="banner-attri" label="Tiêu đề" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Hình ảnh cover" prop="imgCover">
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
            <el-form-item class="banner-attri" label="Từ khóa" prop="keyword">
              <el-input v-model="form.keyword"></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Màn hình" prop="screen">
              <el-select v-model="form.fromScreen" placeholder="Chọn màn hình">
                <el-option
                  v-for="(item) in config.listScreenSEO"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="banner-attri" label="Mô tả" prop="description">
              <el-input type="textarea" :rows="8" v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="width: 100%; display: flex; justify-content: flex-end">
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">{{ formType === 'create' ? 'Thêm mới' : 'Chỉnh sửa' }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <table-pagination
      ref="tableData"
      :url="url"
      :search-params="searchParams"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleAddSeo"
        >
          Thêm SEO mới
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          border
          v-loading="scope.isLoading"
          :data="scope.tableData"
          style="width:100%"
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="STT"
            align="center"
            fixed="left"
            :index="indexMethod"
          />
          <template v-for="column in columnsMap">
            <search-column
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :parent-prop="column.parentProp"
              :is-children="column.isChildren"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column label="Hình ảnh cover" align="center" min-width="200">
            <template slot-scope="scope">
              <img
                style="height: 100%; width: 100%;min-height: 140px; max-height: 200px; object-fit: contain"
                :src="`${config.api.domainUpload}/${scope.row.attributes.imgCover}`"
              />
            </template>
          </el-table-column>
          <template v-for="column in columnsMap1">
            <search-column
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
            align="center"
            label="Tác vụ"
            min-width="80"
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
import { validText } from "@/utils/validate"
import SeoAPI from "@/api/seoApi"
import TablePagination from "@/components/TablePagination"
import SearchColumn from "@/components/SearchColumn"
import { handleSearchInTable } from "@/utils"
import MinIOAPI from "@/api/minioApi"
import vueFilePond, { setOptions } from "vue-filepond"
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginImageTransform from "filepond-plugin-image-transform"
import FilePondPluginImageResize from "filepond-plugin-image-resize"

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
    SearchColumn,
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
      url: `${config.api.seo}?type=1`,
      searchParams: [
        {
          label: 'Từ khóa',
          value: 'slug',
        },
        {
          label: 'Tiêu đề',
          value: 'title',
        },
        {
          label: 'Nội dung',
          value: 'description',
        },
      ],
      imgFile: [],
      columnsMap: [
        // {
        //   label: 'Thứ tự',
        //   prop: 'rank',
        //   minWidth: '40'
        // },
        {
          label: 'Tiêu đề',
          prop: 'title',
          parentProp: 'attributes',
          isChildren: true,
          minWidth: '80'
        },
        {
          label: 'Từ khóa',
          prop: 'keyword',
          parentProp: 'attributes',
          isChildren: true,
          minWidth: '100'
        },
        {
          label: 'Nội dung',
          prop: 'description',
          parentProp: 'attributes',
          isChildren: true,
          minWidth: '150',
        }
      ],
      columnsMap1: [
        {
          label: 'Màn hình',
          prop: 'fromScreen',
          propConfig: 'listScreenSEO',
          type: 'config',
          minWidth: '80',
        },
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '80',
        },
      ],
      config,
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
        rank: 1,
        title: '',
        description: '',
        keyword: '',
        imgCover: '',
        fromScreen: 1,
        active: 1
      },
      formRules: {
        title: [{ required: true, trigger: 'blur', validator: validateText }],
        description: [{ required: true, trigger: 'blur', validator: validateText }],
        keyword: [{ required: true, trigger: 'blur', validator: validateText }],
        rank: [{ required: true, trigger: 'blur', validator: validateText }],
        imgCover: [{ required: true, trigger: 'blur', message: 'Vui lòng chọn ảnh' }],
        fromScreen: [{ required: true, trigger: 'blur', validator: validateText }],
        active: [{ required: true, trigger: 'blur', validator: validateText }],
      },
      formType: '',
      dialogFormVisible: false,
    }
  },

  methods: {
    handleAddSeo() {
      this.formType = 'create'
      this.dialogFormVisible = true
    },
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    onRemoveFile() {
      this.form.imgCover = undefined
      this.imgFile = []
    },
    async handleEdit(prams) {
      this.formType = 'edit'
      this.form = {
        title: prams.attributes.title,
        keyword: prams.attributes.keyword,
        imgCover: prams.attributes.imgCover,
        description: prams.attributes.description,
        rank: prams.rank,
        fromScreen: prams.fromScreen,
        _id: prams._id
      }
      if (this.form.imgCover) {
        this.imgFile = [await this.getImageFilePreview(this.form.imgCover)]
      }
      this.dialogFormVisible = true
    },
    async handleDelete(data) {
      try {
        await SeoAPI.delete(data._id)
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        console.log(err)
      }
    },

    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          const data = {
            attributes: {
              title: this.form.title,
              keyword: this.form.keyword,
              description: this.form.description,
              imgCover: this.form.imgCover,
            },
            rank: this.form.rank,
            fromScreen: this.form.fromScreen,
            type: 1,
            active: 1
          }
          if (this.formType === 'create') {
            await SeoAPI.create(data)
            this.$refs.tableData.refreshData()
            this.resetForm()
          } else {
            await SeoAPI.update(this.form._id, data)
            this.$refs.tableData.refreshData('edit')
            this.resetForm()
          }
          this.dialogFormVisible = false
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    async handleCancel() {
      this.dialogFormVisible = false
      this.resetForm()
    },
    resetForm() {
      this.form = {
        rank: 1,
        title: '',
        description: '',
        keyword: '',
        imgCover: '',
        fromScreen: 1,
        active: 1
      }
      this.imgFile = []
    },
    indexMethod(index) {
      return index + 1
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },

  }
}
</script>

<style scoped>
</style>
