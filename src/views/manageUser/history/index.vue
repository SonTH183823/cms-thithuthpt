<!-- lich su cua user-->
<template>
  <div class="app-container">
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <h3 style="font-weight: bold">Lịch sử người dùng</h3>
      <el-button size="small" style="margin-bottom: 12px; margin-top: 12px" type="primary" @click="handleBack">Xong
      </el-button>
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
          <el-table-column label="Thời gian" align="center" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.createdAt">{{ formatTime(scope.row.createdAt) }}</div>
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
      editAll: false,
      uid: this.$router.currentRoute.params.id,
      url: UserAPI.getHistoryUserAPI(this.$router.currentRoute.params.id),
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
          label: 'Hành động',
          prop: 'type',
          type: 'config',
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
        },
        // {
        //   label: 'Thời gian',
        //   prop: 'createdAt',
        //   type: 'date',
        //   minWidth: '120',
        // }
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
    formatTime(time) {
      return moment(time * 1000).format('hh[h]mm[p] [ngày] DD - MM - YYYY')
    },
  }
}
</script>

<style lang="scss">
.one-row {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 8px 0;
}
</style>

