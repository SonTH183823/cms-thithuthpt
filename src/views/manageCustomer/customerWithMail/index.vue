<!-- danh sach khach hang ban xe-->
<template>
  <div class="app-container">
    <div style=" width: 100%; display: flex; flex-direction: row" class="list-btn">
      <a-button
        class="btn-import"
        style="height: 36px; background-color: #e6a23c"
        @click="exportExcel"
      >
        Export Excel file
      </a-button>
    </div>
    <table-pagination
      ref="tableData"
      :url="url"
      :search-params="searchParams"
      :is-search-date-range="false"
    >

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
            fixed="left"
          />
          <el-table-column label="Ngày tiếp nhận" align="center" min-width="120" sortable prop="createdAt">
            <template slot-scope="scope">
              <div>{{ formatTime(scope.row.createdAt) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Email khách hàng" align="center" min-width="120" sortable prop="email">
            <template slot-scope="scope">
              <div v-if="scope.row.email">{{ scope.row.email }}</div>
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
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import { handleSearchInTable } from "@/utils"
import SellCarCustomerAPI from "@/api/sellCarCustomer"

moment.locale('vi')
export default {
  components: {
    TablePagination,
  },
  data() {
    return {
      config,
      url: `${config.api.userTransaction}/emailLead`,
      searchParams: [],
      loading: false,
    }
  },

  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    formatTime(val) {
      return moment(1000 * val).format('DD/MM/YYYY HH:mm')
    },
    indexMethod(index) {
      return index + 1
    },
    async exportExcel() {
      try {
        this.loading = true
        const response = await SellCarCustomerAPI.getExportCustomerMailExcel()
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `dskh_de_lai_mail_${moment().format("DD_MM_YYYY_HH_mm_ss")}.xlsx`)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.one-row {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 8px 0;
}

.list-btn {
  .btn-import {
    border: unset !important;
    color: white !important;

    :hover :active {
      color: white !important;
      outline: none !important;
      box-shadow: unset !important;
      border: unset !important;
    }
  }

  .ant-btn:hover, .ant-btn:active, .ant-btn:focus {
    color: white !important;
  }
}

</style>

