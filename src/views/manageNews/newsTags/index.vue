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
            label="STT"
            align="center"
            fixed="left"
          />
          <el-table-column align="center" property="name" label="Tên Tag" min-width="100px"></el-table-column>
          <el-table-column align="center" property="createdAt" label="Ngày tạo" min-width="80px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
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
      <el-form ref="formSubmit" :rules="formRules" :model="formSubmit">
        <el-form-item label="Tên tag" prop="name">
          <el-input name="name" ref="name" v-model="formSubmit.name"></el-input>
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
import { validText } from "@/utils/validate"
import moment from "moment"

export default {
  components: {
    TablePagination,
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
      formSubmit: {
        name: '',
        description: '',
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
      url: `${config.api.domain}/tagNews`,
    }
  },
  methods: {
    addNewType() {
      this.formType = 'add'
      this.formSubmit = {
        name: '',
        description: '',
      }
      this.formTitle = 'Thêm mới tag'
      this.dialogVisible = true
    },
    handleEdit(item) {
      this.formType = 'update'
      this.formTitle = 'Cập nhật tag'
      this.formSubmit = { ...item }
      this.dialogVisible = true
    },
    async handleDel(item) {
      await NewsApi.deleteTagNews(item._id)
      await this.$refs.tableData.refreshData('del')
    },
    formatTime(time) {
      return moment(time * 1000).format('DD - MM - YYYY')
    },
    handleClose() {
      this.formSubmit = {}
      this.dialogVisible = false
    },
    async handleSave() {
      const dataSubmit = {
        name: this.formSubmit.name,
        // createdAt: this.formSubmit.createdAt,
        _id: this.formSubmit._id
      }
      await this.$refs['formSubmit'].validate(async valid => {
        if (this.formSubmit.name.length === 0) {
          valid = false
        }
        if (valid) {
          if (this.formType === 'add') {
            await NewsApi.createTagNews(dataSubmit)
            await this.$refs.tableData.refreshData()
          } else {
            await NewsApi.updateTagNews(dataSubmit, dataSubmit._id)
            await this.$refs.tableData.refreshData('edit')
          }
          this.formSubmit = {
            name: '',
            description: '',
          }
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
