<!-- danh sach ban xe va mua xe cua user-->
<template>
  <div class="app-container">
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <h3 style="font-weight: bold">Danh sách đơn mua/bán của người dùng</h3>
      <el-button size="small" style="margin-bottom: 12px; margin-top: 12px" type="primary" @click="handleBack">Xong
      </el-button>
    </div>
    <el-tabs value="first" @tab-click="handleClick">
      <el-tab-pane name="first">
        <span slot="label"><div style="font-weight: bold">Đơn bán</div></span>
        <table-pagination
          ref="tableData"
          :url="url"
          :is-search-date-range="false"
        >
          <template slot="table" slot-scope="scope">
            <el-table
              v-loading="scope.isLoading"
              border
              resizable
              :data="scope.tableData"
              style="width: 100%; font-size: 0.8rem; overflow: auto;"
              :height="`calc(100vh - 270px)`"
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
                  :search-remote="handleSearchSellCar"
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
                  :search-remote="handleSearchSellCar"
                />
              </template>
              <el-table-column label="Ghi chú" align="center" min-width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.note">{{ scope.row.note }}</div>
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                align="center" label="Tác vụ" width="180" >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <el-tooltip content="Sửa" placement="top">-->
              <!--                    <el-button-->
              <!--                      type="primary"-->
              <!--                      size="mini"-->
              <!--                      plain-->
              <!--                      @click="handleEdit(scope.row, 2)">-->
              <!--                      <i class="el-icon-edit"/>-->
              <!--                    </el-button>-->
              <!--                  </el-tooltip>-->
              <!--                  <el-tooltip content="Xóa" placement="top">-->
              <!--                    <el-popconfirm-->
              <!--                      style="margin-left: 5px; margin-right: 5px"-->
              <!--                      confirm-button-text="Đồng ý"-->
              <!--                      cancel-button-text="Hủy"-->
              <!--                      title="Bạn có chắc chắn xóa?"-->
              <!--                      @onConfirm="handleDelete(scope.row)"-->
              <!--                    >-->
              <!--                      <el-button-->
              <!--                        slot="reference"-->
              <!--                        type="danger"-->
              <!--                        size="mini"-->
              <!--                        icon="el-icon-delete"-->
              <!--                      />-->
              <!--                    </el-popconfirm>-->
              <!--                  </el-tooltip>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
            </el-table>
          </template>
        </table-pagination>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"><div style="font-weight: bold">Đơn mua</div></span>
        <table-pagination
          ref="tableDataBuyCar"
          :url="url2"
          :is-search-date-range="false"
        >
          <template slot="table" slot-scope="scope">
            <el-table
              v-loading="scope.isLoading"
              border
              resizable
              :data="scope.tableData"
              style="width: 100%; font-size: 0.8rem; overflow: auto;"
              :height="`calc(100vh - 270px)`"
            >
              <el-table-column
                type="index"
                label="STT"
                align="center"
              />
              <template v-for="column in columnsMap2">
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
                    {{ scope.row.priceRange.toLocaleString('it-IT', {style: 'currency',currency: 'VND'}) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Ghi chú" align="center" min-width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.note">{{ scope.row.note }}</div>
                  <div v-if="scope.row.userReceiver && scope.row.userReceiver[0]">
                    <div>User tiếp nhận: {{ scope.row.userReceiver[0].cmsUsername }}</div>
                    <el-button type="primary" size="mini" plain @click="handleShowHistoryLead(scope.row.userReceiver)">
                      Xem chi tiết
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </table-pagination>
        <el-dialog
          title="Lịch sử trạng thái"
          :visible.sync="dialogFormVisibleState"
          :close-on-click-modal=false
          width="55%"
        >
          <el-table
            :data="userReceiver"
            :before-close="handleCloseState"
            style="width: 100%"
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
      </el-tab-pane>
    </el-tabs>
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
import UserAPI from "@/api/userApi"

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
      url: UserAPI.APIGetListSellCar(this.$router.currentRoute.params.id),
      url2: UserAPI.APIGetListBuyer(this.$router.currentRoute.params.id),
      columnsMap1: [
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
          label: 'Ngày tạo lead',
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
          propConfig: 'stateCarSale'
        },
      ],
      columnsMap2: [
        {
          label: 'Nguồn nhận lead',
          prop: 'from',
          type: 'config',
          minWidth: '160',
        },
        {
          label: 'Số điện thoại',
          prop: 'phoneNumber',
          minWidth: '150',
        },
        {
          label: 'Trạng thái',
          prop: 'state',
          type: 'config',
          minWidth: '150',
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
      ],
      typeEditForm: 0,
      loading: false,
      tableData: [],
      tableData2: [],
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
      dialogFormVisible2: false,
      dialogFormVisibleState: false,
      userReceiver: [],
      searchForm: {}
    }
  },
  methods: {
    handleClick(tab, event) {
      this.form = {}
      this.searchForm = {}
    },
    formatTime(time) {
      return moment(time * 1000).format('hh:mm A [ngày] DD - MM - YYYY')
    },
    handleCloseState() {
      this.userReceiver = []
    },
    handleShowHistoryLead(userReceiver) {
      const len = userReceiver.length
      if (len > 1) {
        if (userReceiver[0].updatedAt < userReceiver[len - 1].updatedAt) {
          this.userReceiver = userReceiver.reverse()
        } else {
          this.userReceiver = userReceiver
        }
      } else {
        this.userReceiver = userReceiver
      }
      this.dialogFormVisibleState = true
    },
    handleBack() {
      this.$router.push('/quan-ly-khach-hang/nguoi-dung/')
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote', 'tableDataBuyCar')
    },
    async handleSearchSellCar(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
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
    handleEdit(params, index) {
      index === 1 ? this.editAll = false : this.editAll = true
      this.form = { ...params }
      this.dialogFormVisible = true
    },
    async handleDelete(prams) {
      try {
        this.loading = true
        await SellCarCustomerAPI.delete(prams._id)
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
    async handleSubmit2() {
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
    handleCancel2() {
      this.dialogFormVisible2 = false
      this.form = {}
    },
    handleEdit2(params, type) {
      this.typeEditForm = type
      this.form = { ...params }
      this.dialogFormVisible2 = true
    },
    async handleDelete2(prams) {
      try {
        this.loading = true
        await UserAPI.delListBuyer(this.uid, prams._id)
        this.loading = false
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        this.loading = false
      }
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

