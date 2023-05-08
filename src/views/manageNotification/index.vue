<template>
  <div class="app-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handelAdd"
        >
          Thêm thông báo mới
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
          <el-table-column label="Tiêu đề" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.notification.title }}
            </template>
          </el-table-column>
          <el-table-column label="Nội dung" align="center" min-width="200">
            <template slot-scope="scope">
              {{ scope.row.notification.body }}
            </template>
          </el-table-column>
          <el-table-column label="Hình ảnh cover" align="center" min-width="200">
            <template slot-scope="scope">
              <img
                v-if="scope.row.imgCover"
                style="height: 100%; width: 100%;min-height: 100px; max-height: 150px; object-fit: contain"
                :src="`${config.api.domainUpload}/${scope.row.imgCover}`"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column label="Thiết bị" align="center" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.deviceTarget.length>0">
                <el-tag
                  v-for="item in scope.row.deviceTarget"
                  :type="config.deviceTypes[item - 1].typeTag"
                  style="margin: 5px"
                >
                  {{ config.deviceTypes[item - 1].label }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Thời gian" align="center" min-width="100">
            <template slot-scope="scope">
              <div>Thời gian: {{ formatTime(scope.row.timeConfig.timeStart) }}</div>
              <div v-if="scope.row.timeConfig.type === 1">Kiểu: Một lần</div>
            </template>
          </el-table-column>
          <el-table-column label="Loại thông báo" align="center" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.target === 1">Hệ thống</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Tác vụ" min-width="120">
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
import NotificationAPI from "@/api/notificationApi"

moment.locale('vi')
export default {
  components: {
    TablePagination,
  },
  data() {
    const targetConfig = {
      ALL: 1,
      USER: 2
    }
    return {
      url: `${config.api.notification}?target=${targetConfig.ALL}`,
      config,
      loading: false,
    }
  },
  methods: {
    formatTime(time) {
      return moment.unix(time).format('DD/MM/YYYY HH:mm:ss')
    },
    handelAdd() {
      this.$router.push('/quan-ly-thong-bao/thong-bao/0')
    },
    handleBack() {
      this.$router.push('/quan-ly-thong-bao/danh-sach')
    },
    handleEdit(row) {
      this.$router.push('/quan-ly-thong-bao/thong-bao/' + row._id)
    },
    async handleDelete(item) {
      try {
        this.loading = true
        await NotificationAPI.delete(item._id)
        this.loading = false
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        this.loading = false
      }
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

