<!-- danh sach khach hang mua xe-->
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
          <template v-for="column in columnsMap">
            <search-column
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :is-children="column.isChildren"
              :parent-prop="column.parentProp"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column label="Nguồn khác" align="center" min-width="120">
            <template slot-scope="scope">
              <div v-if=" scope.row.fromOther">
                <el-tag type="success">
                  {{ scope.row.fromOther }}
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
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column label="Khoảng giá" align="center" min-width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.priceRange">
                {{
                  scope.row.priceRange.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Ghi chú" align="center" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.note">{{ scope.row.note }}</div>
              <div v-if="scope.row.userReceiver && scope.row.userReceiver[scope.row.userReceiver.length -1]">
                User tiếp nhận: {{ scope.row.userReceiver[0].cmsUsername }}
                <el-button type="primary" size="mini" plain @click="handleShowHistoryLead(scope.row.userReceiver)">
                  Xem chi tiết
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center" label="Tác vụ" width="120" fixed="right"
          >
            <template slot-scope="scope">
              <el-tooltip content="Sửa" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handleEdit(scope.row, 2)"
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
      :title="typeEditForm === 1 ? 'Tiếp cận lead' : 'Chỉnh sửa nội dung' "
      :visible.sync="dialogFormVisible"
      :close-on-click-modal=false
      width="40%"
    >
      <el-form ref="form" :model="form" label-width="60px" label-position="top">
        <el-form-item class="banner-attri" label="Ghi chú" prop="note">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.note"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="Lịch sử trạng thái"
      :visible.sync="dialogFormVisibleState"
      :close-on-click-modal=false
      width="55%"
      :fullscreen="false"
    >
      <el-table
        :data="userReceiver"
        :before-close="handleCloseState"
        style="width: 100%"
        max-height="600px"
      >
        <el-table-column
          type="index"
          label="STT"
          align="center"
          fixed="left"
          width="50"
        />
        <el-table-column
          prop="cmsUsername"
          label="User"
          align="center"
          width="250"
        >
        </el-table-column>
        <el-table-column
          prop="oldState"
          align="center"
          label="Trạng thái cũ"
          width="200"
        >
          <template slot-scope="scope">
            <el-tag :type="config.state[scope.row.oldState - 1].typeTag">
              {{ config.state[scope.row.oldState - 1].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="newState"
          align="center"
          label="Trạng thái mới"
          width="200"
        >
          <template slot-scope="scope">
            <el-tag :type="config.state[scope.row.newState - 1].typeTag">
              {{ config.state[scope.row.newState - 1].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="updatedAt"
          label="Thời gian"
        >
          <template slot-scope="scope">
            <div>{{ formatTime(scope.row.updatedAt) }}</div>
          </template>
        </el-table-column>
      </el-table>
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
        :action="`${config.api.userTransaction}/import/lead`"
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
import { handleSearchInTable } from "@/utils"
import SearchColumn from "@/components/SearchColumn"
import BuyCarCustomerAPI from "@/api/buyCarCustomer"
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
      url: `${config.api.userTransaction}/lead`,
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
      typeEditForm: 0,
      columnsMap: [
        {
          label: 'Nguồn từ Web',
          prop: 'from',
          type: 'config',
          minWidth: '150',
        }
      ],
      columnsMap1: [
        // {
        //   label: 'Nguồn từ Web',
        //   prop: 'from',
        //   type: 'config',
        //   minWidth: '160',
        // },
        {
          label: 'Trạng thái',
          prop: 'state',
          type: 'config',
          minWidth: '150',
        },
        {
          label: 'Tên',
          prop: 'name',
          minWidth: '100',
        },
        {
          label: 'Số điện thoại',
          prop: 'phoneNumber',
          minWidth: '100',
        },
        {
          label: 'Xe quan tâm',
          prop: 'carId',
          minWidth: '100',
        },
        {
          label: 'Ngày hẹn',
          prop: 'appointmentDate',
          minWidth: '120',
        },
        {
          label: 'Giờ hẹn',
          prop: 'appointmentHour',
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
      state: ['CHỜ XÁC NHẬN', 'ĐÃ XÁC NHẬN', 'ĐANG LIÊN HỆ', 'HOÀN THÀNH', 'HỦY'],
      sourceLead: ['Liên hệ ngay', 'Đăng ký lái thử', 'Gọi cho tôi', 'KH cần tư vấn tài chính', 'Form mua xe'],
      loading: false,
      tableData: [],
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
      userReceiver: [],
      dialogFormVisibleImportEx: false,
      tableDataEror: [],
      resultImportEx: 'Chọn file excel',
      importError: false
    }
  },

  methods: {
    openImportDialog() {
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
    async exportExcel() {
      try {
        this.loading = true
        const response = await BuyCarCustomerAPI.getExportExcel()
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `dskh_mua_xe_${moment().format("DD_MM_YYYY_HH_mm_ss")}.xlsx`)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    showStatistical() {
      this.$router.push('/quan-ly-khach-hang/thong-ke-danh-sach-mua-xe')
    },
    async dowloadFileTemplate() {
      try {
        this.loading = true
        const link = document.createElement('a')
        link.href = `https://files-cdn.carpla.dev/dev-carpla-tc/lead-template.xlsx`
        link.setAttribute('download', `dskh_mua_xe_template.xlsx`)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    formatTime(time) {
      return moment(time * 1000).format('hh:mm A [ngày] DD - MM - YYYY')
    },
    handleCloseState() {
      this.userReceiver = []
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async setDataTable(data) {
      this.tableData = data.map(item => {
        return {
          ...item,
          _id: item._id,
        }
      })
    },
    handleShowHistoryLead(userReceiver) {
      this.userReceiver = userReceiver || []
      this.dialogFormVisibleState = true
    },
    async loadData() {
      try {
        this.loading = true
        const { data, page, perPage, total } = await BuyCarCustomerAPI.get()
        this.loading = false
        this.page = { page, perPage, total }
        await this.setDataTable(data)
      } catch (err) {
        this.loading = false
      }
    },
    async handleSubmit() {
      const dataSubmit = {
        ...this.form,
        state: this.form.state,
        note: this.form.note
      }
      delete dataSubmit._id
      await BuyCarCustomerAPI.update(this.form._id, dataSubmit)
      await this.$refs.tableData.refreshData('edit')
      this.form = {}
      this.dialogFormVisible = false
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.form = {}
    },
    handleEdit(params, type) {
      this.typeEditForm = type
      this.form = { ...params }
      this.dialogFormVisible = true
    },
    async handleDelete(prams) {
      try {
        this.loading = true
        await BuyCarCustomerAPI.delete(prams._id)
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

