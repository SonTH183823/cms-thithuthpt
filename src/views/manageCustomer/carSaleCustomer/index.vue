<!-- danh sach khach hang ban xe-->
<template>
  <div class="app-container">
    <div style=" width: 100%; display: flex; flex-direction: row" class="list-btn">
      <a-button
        class="btn-import"
        type="primary"
        style="height: 36px;"
        @click="openImportDialog"
      >
        Import Excel file
      </a-button>
      <a-button
        class="btn-import"
        style="height: 36px; background-color: #e6a23c; margin-left: 20px"
        @click="exportExcel"
      >
        Export Excel file
      </a-button>
      <a-button
        class="btn-import"
        style="height: 36px; background-color: #f56c6c; margin-left: 20px"
        @click="dowloadFileTemplate"
      >
        Download Template file
      </a-button>
      <a-button
        class="btn-import"
        style="height: 36px; background-color: #1BAF21; margin-left: 20px"
        @click="showStatistical"
      >
        Xem thống kê
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
          <el-table-column label="Nguồn" align="center" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.fromOther">
                <el-tag type="success">
                  {{ scope.row.fromOther }}
                </el-tag>
              </div>
              <div v-else>
                <el-tag type="info">
                  Web
                </el-tag>
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
          <template v-for="column in columnsMap">
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
          <!--          <el-table-column label="Người tiếp nhận lead" min-width="120"/>-->
          <el-table-column label="Ghi chú" align="center" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.note">{{ scope.row.note }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Tác vụ"
            width="120"
            fixed="right"
          >
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
              <!--              <el-tooltip content="Xóa" placement="top">-->
              <!--                <el-popconfirm-->
              <!--                  style="margin-left: 5px; margin-right: 5px"-->
              <!--                  confirm-button-text="Đồng ý"-->
              <!--                  cancel-button-text="Hủy"-->
              <!--                  title="Bạn có chắc chắn xóa?"-->
              <!--                  @onConfirm="handleDelete(scope.row)"-->
              <!--                >-->
              <!--                  <el-button-->
              <!--                    slot="reference"-->
              <!--                    type="danger"-->
              <!--                    size="mini"-->
              <!--                    icon="el-icon-delete"-->
              <!--                  />-->
              <!--                </el-popconfirm>-->
              <!--              </el-tooltip>-->
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-pagination>
    <el-dialog
      title="Tiếp cận lead"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form ref="form" :model="form" label-width="60px" label-position="top">
        <!--        <el-form-item-->
        <!--          label="Trạng thái"-->
        <!--          label-width="150px"-->
        <!--        >-->
        <!--          <el-select v-model="form.state" placeholder="Chọn trạng thái">-->
        <!--            <el-option-->
        <!--              v-for="(item, index) in state"-->
        <!--              :key="item._id"-->
        <!--              :label="item"-->
        <!--              :value="index + 1"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item class="banner-attri" label="Ghi chú" prop="note">
          <el-input
            v-model="form.note"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
        :action="`${config.api.userTransaction}/import/sellCar`"
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
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import { handleSearchInTable } from "@/utils"
import SearchColumn from "@/components/SearchColumn"
import SellCarCustomerAPI from "@/api/sellCarCustomer"

moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    const token = localStorage.getItem(config.tokenKey)
    return {
      config,
      header: {
        'x-access-token': token,
      },
      url: `${config.api.userTransaction}/sellCar`,
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
          label: 'Tên đăng bán',
          prop: 'name',
          minWidth: '120',
        },
        {
          label: 'Số điện thoại đăng bán',
          prop: 'phoneNumber',
          minWidth: '120',
        },
        {
          label: 'Biển số xe',
          prop: 'licensePlateNumber',
          minWidth: '120',
        },
        {
          label: 'Tỉnh thành',
          prop: 'province',
          minWidth: '120',
        },
        {
          label: 'Ngày nhận lead',
          prop: 'createdAt',
          type: 'date',
          minWidth: '120',
        }
      ],
      state: ['ĐANG BÁN', 'ĐÃ BÁN', 'HỦY'],
      columnsMap: [
        {
          label: 'Trạng thái',
          prop: 'state',
          type: 'config',
          minWidth: '120',
          propConfig: 'state'
        },
      ],
      loading: false,
      form: {
        _id: '',
        note: '',
        name: '',
        state: '',
        createAt: '',
        licensePlateNumber: '',
        phoneNumber: ''
      },
      dialogFormVisible: false,
      dialogFormVisibleState: false,
      dialogFormVisibleImportEx: false,
      tableDataEror: [],
      resultImportEx: 'Chọn file excel',
      importError: false,
      tableDT: []
    }
  },
  mounted() {
    if (this.$refs.tableData.tableData) {
      this.tableDT = this.$refs.tableData.tableData
    }
  },

  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
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
        if (file.response.length === 0) {
          this.importError = false
          this.resultImportEx = `Import ${file.name} thành công!`
          this.$refs.tableData.refreshData()
        } else {
          this.importError = true
          this.resultImportEx = `Importing ${file.name} thất bại!`
        }
      }
    },
    async handleSubmit() {
      const dataSubmit = {
        ...this.form,
        note: this.form.note
      }
      delete dataSubmit._id
      await SellCarCustomerAPI.update(this.form._id, dataSubmit)
      this.$refs.tableData.refreshData('edit')
      this.form = {}
      this.dialogFormVisible = false
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.form = {}
    },
    handleEdit(params) {
      this.form = { ...params }
      this.dialogFormVisible = true
    },
    async handleDelete(prams) {
      try {
        this.loading = true
        await SellCarCustomerAPI.delete(prams._id)
        this.loading = false
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        this.loading = false
      }
    },
    indexMethod(index) {
      return index + 1
    },
    openImportDialog() {
      this.resultImportEx = 'Chọn file excel'
      this.dialogFormVisibleImportEx = true
    },
    async exportExcel() {
      try {
        this.loading = true
        const response = await SellCarCustomerAPI.getExportExcel()
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `dskh_ban_xe_${moment().format("DD_MM_YYYY_HH_mm_ss")}.xlsx`)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    dowloadFileTemplate() {
      try {
        this.loading = true
        const link = document.createElement('a')
        link.href = `https://files-cdn.carpla.dev/dev-carpla-tc/sellCar-template.xlsx`
        link.setAttribute('download', `dskh_ban_xe_template.xlsx`)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    showStatistical() {
      this.$router.push('/quan-ly-khach-hang/thong-ke-danh-sach-ban-xe')
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

