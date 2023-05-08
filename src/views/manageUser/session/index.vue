<!-- lich su cua user-->
<template>
  <div class="app-container">
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <h3 style="font-weight: bold">Phiên người dùng</h3>
      <div>
        <el-button size="small" style="margin-bottom: 12px; margin-top: 12px" type="danger" @click="handleDeleteAll">Xóa tất cả thiết bị</el-button>
        <el-button size="small" style="margin-bottom: 12px; margin-top: 12px" type="primary" @click="handleBack">Xong</el-button>
      </div>
    </div>
    <table-pagination
      ref="tableData"
      :url="url"
      resizable
      :search-params="searchParams"
      :isPagination="false"
      :is-search-date-range="false">
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          border
          resizable
          :data="scope.tableData"
          style="width: 100%; font-size: 0.8rem; overflow: auto;"
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="STT"
            align="center"
          />
          <template v-for="column in columnsMap1">
            <search-column
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :is-children="column.isChildren"
              :parent-prop="column.parentProp"
              :prop-config="column.propConfig"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column
            align="center" label="Tác vụ" width="120" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="Xóa thiết bị" placement="top">
                <el-popconfirm
                  style="margin-left: 5px; margin-right: 5px"
                  confirm-button-text="Đồng ý"
                  cancel-button-text="Hủy"
                  title="Bạn có chắc chắn xóa?"
                  @onConfirm="handleDelete(scope.row._id)"
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
import {handleSearchInTable} from "@/utils";
import SearchColumn from "@/components/SearchColumn";
import UserAPI from "@/api/userApi";

moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    return {
      config,
      uid: this.$router.currentRoute.params.id,
      url: UserAPI.getSessionUserAPI(this.$router.currentRoute.params.id),
      searchParams: [
        {
          label: 'Tiêu đề',
          value: 'title',
        },
        {
          label: 'Tìm kiếm theo ngày',
          type: 'date'
        },
      ],
      columnsMap1: [
        {
          label: 'Thời gian',
          prop: 'authTime',
          type: 'date',
          minWidth: '120',
          propConfig: 'historyType'
        },
        {
          label: 'Nền tảng',
          prop: 'deviceType',
          propConfig: 'deviceTypes',
          type: 'config',
          minWidth: '120',
        },
        {
          label: 'Thiết bị',
          prop: 'deviceName',
          minWidth: '120',
        },
        {
          label: 'ID Thiết bị',
          prop: 'deviceId',
          minWidth: '120',
        }
      ]
    }
  },
  methods: {
    handleBack() {
      this.$router.push('/quan-ly-khach-hang/nguoi-dung/')
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async handleDeleteAll() {
      try {
        this.loading = true
        await UserAPI.deleteAllUserSession(this.uid)
        this.loading = false
        this.$refs.tableData.refreshData('edit')
      } catch (err) {
        this.loading = false
      }
    },
    async handleDelete(uid) {
      try {
        this.loading = true
        await UserAPI.deleteUserSession(this.uid, uid)
        this.loading = false
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        this.loading = false
      }
    },
  }
}
</script>

