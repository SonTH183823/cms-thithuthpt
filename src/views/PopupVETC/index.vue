<template>
  <div class="app-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :search-form="searchForm"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          Thêm chiến dịch mới
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
          <template v-for="column in columnsMap">
            <search-column
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column label="Hình ảnh" align="center" min-width="250">
            <template slot-scope="scope">
              <img
                style="height: 100%; width: 100%;min-height: 140px; max-height: 250px; object-fit: contain"
                :src="`${config.api.domainUpload}/${scope.row.image}`"
              />
            </template>
          </el-table-column>
          <template v-for="column in columnsMap2">
            <search-column
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :prop-config="column.propConfig"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column label="Link" align="center" min-width="100">
            <template slot-scope="scope">
              <a
                :href="scope.row.url"
                target="_blank"
                style="text-decoration: underline; font-style: italic; color: #0A9F46"
              >{{ scope.row.url }}</a>
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái khách hàng" align="center" min-width="100">
            <template slot-scope="scope">
              <span style="color: yellowgreen"
              >{{
                  scope.row.type === 1 ? "Tất cả tệp khách hàng" : scope.row.uploadExcel ? "Đã upload tập khách hàng" : "Chưa upload tập khách hàng"
                }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Tập khách hàng" align="center" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 1">Tất cả</div>
              <div v-else>
                <div>
                  <a-button
                    class="btn-import"
                    type="primary"
                    style="height: 36px;"
                    @click="openImportDialog(scope.row._id)"
                  >
                    {{ scope.row.uploadExcel === 1 ? "Update Excel file " : "Import Excel file" }}
                  </a-button>
                </div>
              </div>
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
            />
          </template>
          <el-table-column align="center" label="Tác vụ" min-width="100">
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
    <el-dialog
      title="Import Excel file"
      :visible.sync="dialogFormVisibleImportEx"
      :close-on-click-modal="false"
      :before-close="handleCancelImport"
      width="40%"
      center
    >
      <a-upload
        name="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :action="`${config.api.popupVETCUpload}/import/campaignClient?campaignId=${campaignIdSelected}`"
        :headers="header"
        :show-upload-list="false"
        @change="fileListChange"
      >
        <div style="display: flex;flex-direction: row; width: 100%; justify-content: center; align-items: center">
          <a-button
            type="primary"
            style="height: 36px; margin-left: 20px"
          >
            Import Excel file
          </a-button>
          <div v-if="!importError" style="margin-left: 30px; color: black;">{{ resultImportEx }}</div>
          <div v-else style="margin-left: 30px; color: red;">{{ resultImportEx }}</div>
        </div>
      </a-upload>
      <h3
        v-if="tableDataEror.length > 0"
        style=" display: flex; font-weight: bold; width: 100%; align-items: center; justify-content: center; margin-top: 20px; margin-bottom: 10px"
      >
        Những hàng lỗi</h3>
      <el-table
        v-if="tableDataEror.length > 0"
        :data="tableDataEror"
        style="width: 100%;"
        border
        max-height="400px"
      >
        <el-table-column
          type="index"
          label="STT"
          align="center"
          fixed="left"
        />
        <el-table-column
          prop="num"
          label="Dòng"
          align="center"
          width="180"
        />
        <el-table-column
          prop="error"
          align="center"
          label="Lỗi"
        />
      </el-table>
      <div style="display: flex; justify-content: flex-end; width: 100%; margin-top: 20px">
        <a-button @click="handleCancelImport">Xong</a-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from '@/utils/config'
import moment from 'moment'
import TablePagination from "@/components/TablePagination"
import SearchColumn from "@/components/SearchColumn"
import { handleSearchInTable } from "@/utils"
import PopupVETCAPI from "@/api/popupVETC"

moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn,
  },
  data() {
    const token = localStorage.getItem(config.tokenKey)
    return {
      url: `${config.api.popupVETC}`,
      header: {
        'x-access-token': token,
      },
      config,
      loading: false,
      searchForm: {},
      columnsMap1: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '100',
        },
      ],
      columnsMap2: [
        {
          label: 'Thời gian bắt đầu',
          prop: 'startTime',
          type: 'datetime',
          minWidth: '100',
        },
        {
          label: 'Thời gian kết thúc',
          prop: 'endTime',
          type: 'datetime',
          minWidth: '100',
        },
      ],
      columnsMap: [
        {
          label: 'Tên chiến dịch',
          prop: 'name',
          minWidth: '100'
        },
      ],
      resultImportEx: '',
      dialogFormVisibleImportEx: false,
      tableDataEror: [],
      importError: false,
      campaignIdSelected: undefined
    }
  },
  methods: {
    handleAdd() {
      this.$router.push('/popup-vetc/chi-tiet/0')
    },
    handleEdit(row) {
      this.$router.push('/popup-vetc/chi-tiet/' + row._id)
    },
    async handleDelete(popup) {
      try {
        this.loading = true
        await PopupVETCAPI.delete(popup._id)
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
    openImportDialog(id) {
      console.log(id)
      this.campaignIdSelected = id
      this.resultImportEx = 'Chọn file excel'
      this.dialogFormVisibleImportEx = true
    },
    handleCancelImport() {
      this.tableDataEror = []
      this.dialogFormVisibleImportEx = false
      this.importError = false
    },
    fileListChange({ file }) {
      if (file.status === 'uploading') {
        this.resultImportEx = `Importing ${file.name} ...`
      } else if (file.status === 'error') {
        this.importError = true
        this.resultImportEx = `Importing ${file.name} thất bại!`
      } else if (file.status === 'done') {
        this.tableDataEror = file.response
        if (file.response.ok) {
          this.importError = false
          this.resultImportEx = `Import ${file.name} thành công!`
          this.$refs.tableData.refreshData()
        } else {
          this.importError = true
          this.resultImportEx = `Importing ${file.name} thất bại!`
        }
      }
    },
  }
}
</script>

