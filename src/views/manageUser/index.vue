<template>
  <div class="app-container">
    <el-dialog
      title="Chỉnh sửa thông tin"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal=false
      width="40%"
    >
      <el-form ref="form" :model="form" label-width="60px" label-position="top">
        <el-form-item class="banner-attri" label="Ghi chú" prop="note">
          <el-input type="textarea" :rows="2" v-model="form.note"></el-input>
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
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          border
          :data="scope.tableData"
          style="width: 100%; font-size: 0.8rem; overflow: auto;"
          :height="`calc(100vh - 150px)`"
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
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column label="Hình ảnh đại diện" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.avatar"
                style="width:80px; height: auto"
                :src="scope.row.avatar.substring(0,4) === 'http' ? `${scope.row.avatar}` : config.api.domainUpload + '/' + scope.row.avatar"
                alt="Ảnh đại diện"
              />
            </template>
          </el-table-column>
          <template v-for="column in columnsMap1">
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
          <el-table-column label="Ghi chú" prop="note" align="center" min-width="150"></el-table-column>
          <el-table-column
            align="center" label="Tác vụ" width="300" fixed="right"
          >
            <template slot-scope="scope">
              <el-tooltip content="Ghi chú" placement="left">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handleEdit(scope.row)"
                >
                  <i class="el-icon-edit"/>
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="!scope.row.isLocked" content="Chặn" placement="top">
                <el-popconfirm
                  style="margin-left: 5px;"
                  confirm-button-text="Đồng ý"
                  cancel-button-text="Hủy"
                  title="Chặn người dùng?"
                  @onConfirm="handleBlock(scope.row)"
                >
                  <el-button
                    slot="reference"
                    type="warning"
                    size="mini"
                    icon="el-icon-lock"
                  />
                </el-popconfirm>
              </el-tooltip>
              <el-tooltip v-else content="Bỏ chặn" placement="top">
                <el-button
                  style="margin-left: 5px;"
                  type="info"
                  size="mini"
                  @click="handleBlock(scope.row)"
                >
                  <i class="el-icon-unlock"/>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Xóa" placement="right">
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
  </div>
</template>

<script>
import config from '@/utils/config'
import moment from 'moment'
import TablePagination from "@/components/TablePagination"
import { handleSearchInTable } from "@/utils"
import SearchColumn from "@/components/SearchColumn"
import UserAPI from "@/api/userApi"

moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    return {
      url: UserAPI.getURLUser(),
      config,
      columnsMap: [
        {
          label: 'Nguồn tài khoản',
          prop: 'provider',
          // type: 'config',
          minWidth: '120',
        },
      ],
      columnsMap1: [
        {
          label: 'Tên người dùng',
          prop: 'name',
          minWidth: '100',
        },
        {
          label: 'Số điện thoại',
          prop: 'phoneNumber',
          minWidth: '100',
        },
        {
          label: 'Email',
          prop: 'email',
          minWidth: '100',
        },
        {
          label: 'Trạng thái',
          prop: 'isLocked',
          type: 'config',
          minWidth: '100',
        },
      ],
      form: {},
      dialogFormVisible: false,
    }
  },

  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleEdit(prams) {
      this.form = { ...prams }
      this.dialogFormVisible = true
    },
    async handleBlock(user) {
      const dt = {
        isLocked: user.isLocked === 1 ? 0 : 1
      }
      await UserAPI.blockUser(dt, user.uid)
      this.$refs.tableData.refreshData()
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.form = {}
    },
    async handleDel(user) {
      await UserAPI.deleteUer(user.uid)
      this.$refs.tableData.refreshData()
    },
    async handleSubmit() {
      const data = {
        ...this.form,
        signature: 1
      }
      await UserAPI.update(data, this.form.uid)
      this.form = {}
      this.$refs.tableData.refreshData('edit')
      this.dialogFormVisible = false
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

