<template>
  <div v-loading="loadingCategory" class="news-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button size="small" type="primary" @click="addNewType">
          Thêm lĩnh vực mới
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          :data="scope.tableData"
          :default-sort="{ prop: 'rank', order: 'ascending' }"
          border
          resizable
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="STT"
            align="center"
            fixed="left"
          />
          <el-table-column align="center" property="rank" label="Thứ tự" sortable min-width="50px"></el-table-column>
          <el-table-column align="center" property="name" label="Tên lĩnh vực" min-width="100px"></el-table-column>
          <el-table-column prop="createdAt" align="center" label="Ngày tạo" min-width="100" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.createdAt ? formatTime(scope.row.createdAt, '{h}:{i} ngày {d}-{m}-{y}') : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="Người tạo" align="center" min-width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.createdBy">{{ scope.row.createdBy.username }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" property="description" label="Ghi chú" min-width="150px"></el-table-column>
          <template v-for="column in columnsMap">
            <search-column
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
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
      :title="this.formTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal=false
      width="40%"
    >
      <el-form ref="formSubmit" :rules="formRules" :model="formSubmit" label-position="top">
        <el-form-item label="Thứ tự" prop="rank">
          <el-input-number v-model="formSubmit.rank" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="Tên lĩnh vực" prop="name">
          <el-input name="name" ref="name" v-model="formSubmit.name"></el-input>
        </el-form-item>
        <el-form-item label="Ghi chú" prop="description">
          <el-input type="textarea" :rows="4" v-model="formSubmit.description"></el-input>
        </el-form-item>
        <el-form-item sortable class="banner-attri" label="Kích hoạt">
          <el-switch v-model="formSubmit.active" :active-value="1" :inactive-value="0" active-color="#13ce66"
                     style="margin-right: 10px;"/>
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

import RecruitmentAPI from "@/api/recruitmentApi"
import config from "@/utils/config"
import TablePagination from '@/components/TablePagination/index'
import { validText } from "@/utils/validate"
import { handleSearchInTable, parseTime } from "@/utils"
import SearchColumn from "@/components/SearchColumn"

export default {
  components: {
    TablePagination,
    SearchColumn
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
      isDisabled: true,
      loadingNews: false,
      isOutStanding: false,
      formSubmit: {
        rank: 1,
        name: '',
        description: '',
        active: 1,
      },
      columnsMap: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '90',
        },
      ],
      formRules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: 'Trường này không thể bỏ trống',
          validator: validateText
        }],
        rank: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn thứ tự',
        }],
        active: [{
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
      url: `${config.api.domainRecruitment}/cateRecruit`,
    }
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    addNewType() {
      this.formType = 'add'
      this.formSubmit = {
        name: '',
        description: '',
        rank: 1,
        active: 1,
      }
      this.formTitle = 'Thêm mới lĩnh vực'
      this.dialogVisible = true
    },
    handleEdit(item) {
      this.formType = 'update'
      this.formTitle = 'Cập nhật thông tin lĩnh vực'
      this.formSubmit = { ...item }
      this.dialogVisible = true
    },
    async handleDel(item) {
      await RecruitmentAPI.deleteCateRecruitment(item._id)
      await this.$refs.tableData.refreshData('del')
    },
    handleClose() {
      this.formSubmit = {}
      this.dialogVisible = false
    },
    async handleSave() {
      const dataSubmit = {
        ...this.formSubmit
      }
      await this.$refs['formSubmit'].validate(async valid => {
        if (valid) {
          if (this.formType === 'add') {
            await RecruitmentAPI.createCateRecruitment(dataSubmit)
            await this.$refs.tableData.refreshData()
          } else {
            await RecruitmentAPI.updateCateRecruitment(dataSubmit, dataSubmit._id)
            await this.$refs.tableData.refreshData('edit')
          }
          this.formSubmit = {
            name: '',
            description: '',
            rank: 1,
            active: 1
          }
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatTime(timeStamp, format) {
      return parseTime(timeStamp, format)
    },
  }
}
</script>

<style scoped>
.news-container {
  padding: 20px;
}
</style>
