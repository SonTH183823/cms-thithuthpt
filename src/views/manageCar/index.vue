<!--ql xe-->
<template>
  <div class="app-container">
    <div class="list-btn" style=" width: 100%; display: flex; flex-direction: row">
      <el-button
        type="primary"
        size="medium"
        @click="handleAdd"
      >
        Thêm xe mới
      </el-button>
      <a-button
        class="btn-import"
        type="primary"
        style="height: 36px; background-color: #e6a23c; color: white; margin-left: 20px"
        @click="exportExcel()"
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
          <el-table-column
            label="Ảnh"
            align="center"
            fixed="left"
            min-width="160"
          >
            <template slot-scope="scope">
              <div>
                <img
                  :src="config.api.domainUpload + '/' + scope.row.imgCover"
                  alt=""
                  style="max-height: 100px; aspect-ratio: 4/3"
                >
              </div>
            </template>
          </el-table-column>
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
          <el-table-column label="Thông tin" min-width="160">
            <template slot-scope="scope">
              <li>Hãng xe: {{ scope.row.attributes.manufacturer.name }}</li>
              <li>Dòng xe: {{ scope.row.attributes.brand.name }}</li>
              <li>Năm SX: {{ scope.row.attributes.year }}</li>
            </template>
          </el-table-column>
          <el-table-column label="Giá dự kiến / Giá thực tế" min-width="140">
            <template slot-scope="scope">
              <div>
                <li>Giá dự kiến:
                  {{ scope.row.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) }}
                </li>
                <li v-if="scope.row.listedPrice">Giá thực tế:
                  {{ scope.row.listedPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) }}
                </li>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Thông số kỹ thuật" align="center" min-width="380">
            <template slot-scope="scope">
              <div>
                <el-row>
                  <el-col :span="12">
                    <div v-if="scope.row.attributes" class="one-row">• Động cơ: {{ scope.row.attributes.engine }}</div>
                    <div v-if="scope.row.attributes && scope.row.attributes.figure" class="one-row">• Kiểu dáng:
                      {{ scope.row.attributes.figure.name }}
                    </div>
                    <div v-if="scope.row.attributes && scope.row.attributes.numberSeat" class="one-row">• Số chỗ:
                      {{ scope.row.attributes.numberSeat }}
                    </div>
                    <div v-if="scope.row.attributes && scope.row.attributes.fuel" class="one-row">• Nhiên liệu:
                      {{ scope.row.attributes.fuel.type }}
                    </div>
                    <div v-if="scope.row.attributes && scope.row.attributes.drive" class="one-row">• Dẫn động:
                      {{ scope.row.attributes.drive.name }}
                    </div>
                    <div v-if="scope.row.attributes && scope.row.attributes.gear" class="one-row">• Hộp số:
                      {{ scope.row.attributes.gear.name }}
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div v-if="scope.row.attributes" class="one-row">
                      • Xuất xứ: {{ scope.row.attributes.origin.source || '' }}
                    </div>
                    <div v-if="scope.row.attributes" class="one-row">
                      • Phiên bản: {{ scope.row.attributes.version }}
                    </div>
                    <div v-if="scope.row.attributes" class="one-row">
                      • Dung tích xi lanh: {{ scope.row.attributes.cc }} cc
                    </div>
                    <div v-if="scope.row.attributes" class="one-row">
                      • Mã lực: {{ scope.row.attributes.horsePower }}
                    </div>
                    <div v-if="scope.row.attributes" class="one-row">
                      • Mô-men xoắn: {{ scope.row.attributes.torque }}
                    </div>
                    <div v-if="scope.row.attributes" class="one-row">
                      • Kích thước: {{ scope.row.attributes.size }}
                    </div>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <template v-for="column in columnsMap">
            <search-column
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :prop-config="column.propConfig"
              :min-width="column.minWidth"
              :is-children="column.isChildren"
              :parent-prop="column.parentProp"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column align="center" label="Tác vụ" width="80" fixed="right">
            <template slot-scope="scope">
              <div>
                <el-row>
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
                </el-row>
                <el-row style="margin-top: 5px; margin-bottom: 5px">
                  <el-tooltip content="Tạo xe ảo" placement="left">
                    <el-button
                      type="warning"
                      size="mini"
                      plain
                      @click="handleCreateVirtualCar(scope.row)"
                    >
                      <i class="el-icon-plus"/>
                    </el-button>
                  </el-tooltip>
                </el-row>
                <el-row style="margin-bottom: 5px">
                  <el-tooltip content="Kiểm định" placement="left">
                    <el-button
                      type="success"
                      size="mini"
                      @click="handleCheckCar(scope.row)"
                    >
                      <i class="el-icon-info"/>
                    </el-button>
                  </el-tooltip>
                </el-row>
                <el-row>
                  <el-tooltip content="Xóa" placement="bottom">
                    <el-popconfirm
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
                </el-row>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-pagination>
    <el-dialog
      title="Import Excel file"
      :visible.sync="dialogFormVisibleEx"
      :close-on-click-modal="false"
      :before-close="handleCancelImport"
      width="40%"
      center
    >
      <a-upload
        name="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :action="`${config.api.domainCar}/import/car`"
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
      >Những hàng lỗi</h3>
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
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import { handleSearchInTable } from "@/utils"
import SearchColumn from "@/components/SearchColumn"
import CarAPI from '@/api/carApi'

moment.locale('vi')
export default {
  name: "ModelCar",
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    const token = localStorage.getItem(config.tokenKey)
    return {
      config,
      url: `${config.api.domainCar}/car?copied=0`,
      header: {
        'x-access-token': token,
      },
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
          label: 'Kiểm định',
          prop: 'inspected',
          type: 'config',
          propConfig: 'inspectedCar',
          minWidth: '120',
        },
        {
          label: 'Tên xe',
          prop: 'name',
          minWidth: '150',
        },
        {
          label: 'Biển số',
          prop: 'licensePlates',
          minWidth: '150',
        },
      ],
      columnsMap: [
        {
          label: 'Trạng thái',
          prop: 'status',
          type: 'config',
          propConfig: 'statusMyCar',
          minWidth: '120',
        },
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '150',
        },
      ],
      loading: false,
      tableData: [],
      form: {},
      dialogFormVisible: false,
      dialogFormVisibleEx: false,
      tableDataEror: [],
      resultImportEx: 'Chọn file excel',
      importError: false
    }
  },

  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleCancelImport() {
      this.tableDataEror = []
      this.dialogFormVisibleEx = false
      this.importError = false
    },
    fileListChange({ file }) {
      if (file.status === 'uploading') {
        this.resultImportEx = `Importing ${file.name} ...`
      } else if (file.status === 'error') {
        this.importError = true
        this.resultImportEx = `Importing ${file.name} thất bại!`
      } else if (file.status === 'done') {
        this.importError = false
        this.tableDataEror = file.response
        this.resultImportEx = `Import ${file.name} thành công!`
        this.$refs.tableData.refreshData()
      }
    },
    async setDataTable(data) {
      this.tableData = data.map(item => {
        return {
          ...item,
          _id: item._id,
          note: item.note,
          logo: item.logo,
          name: item.name,
          active: item.active
        }
      })
    },
    handleAdd() {
      this.$router.push('/quan-ly-xe/danh-sach-xe-odoo')
    },
    openImportDialog() {
      this.resultImportEx = 'Chọn file excel'
      this.dialogFormVisibleEx = true
    },
    dowloadFileTemplate() {
      try {
        this.loading = true
        const link = document.createElement('a')
        link.href = `https://files-cdn.carpla.dev/img/cms/car.xlsx`
        link.setAttribute('download', `ds_xe_template.xlsx`)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    async exportExcel() {
      try {
        this.loading = true
        const response = await CarAPI.getExportExcel({ copied: 0 })
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `ds_xe_that_${moment().format("DD_MM_YYYY_HH_mm_ss")}.xlsx`)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    showDetails(prams) {
      this.form = prams
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.$router.push({ path: '/quan-ly-xe/chi-tiet-xe-odoo/' + row._id, query: { type: 'edit' } })
    },
    handleCreateVirtualCar(row) {
      this.$router.push({ path: '/quan-ly-xe/chi-tiet-xe/' + row._id, query: { type: 'virtual' } })
    },
    handleCheckCar(row) {
      this.$router.push({ path: '/quan-ly-xe/kiem-dinh-xe/' + row.id, query: { type: 'real' } })
    },
    async handleDelete(prams) {
      try {
        this.loading = true
        await CarAPI.delete(prams._id)
        this.loading = false
        this.$refs.tableData.refreshData('del')
        await this.loadData()
      } catch (err) {
        this.loading = false
      }
    },
    indexMethod(index) {
      return index + 1
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
