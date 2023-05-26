<template>
  <div v-loading="loadingCategory" class="news-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button size="small" type="primary" @click="addNewType">
          Thêm mới
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          :data="scope.tableData"
          border
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="#"
            align="center"
            fixed="left"
          />
          <el-table-column align="center" property="name" label="Loại tin tức" min-width="100px"></el-table-column>
          <el-table-column align="center" label="Danh mục nổi bật" min-width="100px">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.isOutStanding === 1">
                Danh mục nổi bật
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Người tạo" min-width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.createdBy">{{ scope.row.createdBy.username || 'unknown' }} - {{ scope.row.createdBy.name || 'unknown' }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" property="description" label="Mô tả" min-width="150px"></el-table-column>
          <el-table-column align="center" label="Tác vụ" width="180" min-width="150px" fixed="right">
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
                  @onConfirm="handleDel(scope.row)"
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

    <el-dialog
      :title="formTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-checkbox v-model="isOutStanding" label="Danh mục nổi bật" border style="margin-top: 10px"></el-checkbox>
      <el-form ref="formSubmit" :rules="formRules" :model="formSubmit">
        <el-form-item label="Tên loại tin tức" prop="name">
          <el-input name="name" ref="name" v-model="formSubmit.name"></el-input>
        </el-form-item>
        <el-form-item label="Mô tả" prop="description">
          <el-input type="textarea" v-model="formSubmit.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">Hủy</el-button>
        <el-button type="primary" @click="handleSave()">Lưu</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>

import NewsApi from "@/api/newsApi"
import config from "@/utils/config"
import TablePagination from '@/components/TablePagination/index'
import {validText} from "@/utils/validate"

export default {
  components: {
    TablePagination
  },
  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đầy đủ trường'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      dialogVisibleSEO: false,
      IdObject: '',
      isOutStanding: false,
      formSubmit: {
        name: '',
        description: '',
        isOutStanding: 0,
      },
      formRules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: 'Trường này không thể bỏ trống',
          validator: validateText
        }]
      },
      loadingCategory: false,
      formTitle: '',
      formType: 'add',
      config,
      url: `${config.api.domain}/cateNews`,
    }
  },
  methods: {
    onUpdateVisiableSEO(e) {
      this.dialogVisibleSEO = e.data.visible
    },
    addNewType() {
      this.formType = 'add'
      this.formSubmit = {
        name: '',
        description: '',
        isOutStanding: 0
      }
      this.formTitle = 'Thêm mới loại tin tức'
      this.dialogVisible = true
    },
    handleEdit(item) {
      this.formType = 'update'
      this.formTitle = 'Cập nhật loại tin tức'
      this.formSubmit = {...item}
      if (this.formSubmit.isOutStanding) {
        this.isOutStanding = true
      } else {
        this.isOutStanding = false
      }
      this.dialogVisible = true
    },
    handleSEO(id) {
      this.IdObject = id
      this.dialogVisibleSEO = true
      // this.$router.push({ path: '/quan-ly-seo/chi-tiet-seo/' + id, query: { targetType: 'cateNewsId' }})
    },
    async handleDel(item) {
      await NewsApi.deleteCategoryNews(item._id)
      await this.$refs.tableData.refreshData('del')
    },
    handleClose() {
      this.formSubmit = {}
      this.isOutStanding = false
      this.dialogVisible = false
    },
    async handleSave() {
      if (this.isOutStanding) {
        this.formSubmit.isOutStanding = 1
      } else {
        this.formSubmit.isOutStanding = 0
      }
      const dataSubmit = {...this.formSubmit}
      if (this.formSubmit?.createdBy) {
        dataSubmit.createdBy = this.formSubmit.createdBy._id || ''
      }
      await this.$refs['formSubmit'].validate(async valid => {
        if (this.formSubmit.name.length === 0) {
          valid = false
        }
        if (valid) {
          if (this.formType === 'add') {
            await NewsApi.createCategoryNews(dataSubmit)
            await this.$refs.tableData.refreshData()
          } else {
            await NewsApi.updateCategoryNews(dataSubmit, dataSubmit._id)
            await this.$refs.tableData.refreshData('edit')
          }
          this.formSubmit = {
            name: '',
            description: '',
            isOutStanding: 0
          }
          this.isOutStanding = false
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style scoped>
.news-container {
  padding: 20px;
}
</style>
