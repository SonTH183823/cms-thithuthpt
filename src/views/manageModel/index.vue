<!--model xe-->
<template>
  <div class="app-container">
    <el-dialog
      title="Thông số kỹ thuật"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal=false
      width="40%"
    >
      <el-row :gutter="20">
        <el-col :xl="12" :lg="12">
          <div class="one-row">• Động cơ: {{ form.engine }}</div>
          <div class="one-row">• Kiểu dáng: {{ form.figure }}</div>
          <div class="one-row">• Số chỗ: {{ form.numberSeat }}</div>
          <div class="one-row">• Nhiên liệu: {{ form.fuel }}</div>
          <div class="one-row">• Dẫn động: {{ form.drive }}</div>
          <div class="one-row">• Hộp số: {{ form.gear }}</div>
        </el-col>
        <el-col :xl="12" :lg="12">
          <div class="one-row">• Xuất xứ: {{ form.origin }}</div>
          <div class="one-row">• Phiên bản: {{ form.version }}</div>
          <div class="one-row">• Dung tích xi lanh: {{ form.cc }} cc</div>
          <div class="one-row">• Mã lực: {{ form.horsePower }}</div>
          <div class="one-row">• Mô-men xoắn: {{ form.torque }}</div>
          <div class="one-row">• Kích thước: {{ form.size }}</div>
        </el-col>
      </el-row>
    </el-dialog>
    <table-pagination
      ref="tableData"
      :url="url"
      :search-params="searchParams"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          Thêm model xe mới
        </el-button>
      </template>
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
          <el-table-column label="Hãng xe" align="center" min-width="80">
            <template slot-scope="scope">
              <div>{{ scope.row.manufacturer.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Dòng xe" align="center" min-width="80">
            <template slot-scope="scope">
              <div>{{ scope.row.brand.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Năm sản xuất" prop="year" align="center" min-width="120" sortable></el-table-column>
          <el-table-column label="Thông số kỹ thuật" align="center" min-width="480">
            <template slot-scope="scope">
              <div>
                <el-row>
                  <el-col :span="12">
                    <div class="one-row">• Động cơ: {{ scope.row.engine }}</div>
                    <div class="one-row">• Kiểu dáng: {{ scope.row.figure && scope.row.figure.name }}</div>
                    <div class="one-row">• Số chỗ: {{ scope.row.numberSeat }}</div>
                    <div class="one-row">• Nhiên liệu: {{ scope.row.fuel && scope.row.fuel.type }}</div>
                    <div class="one-row">• Dẫn động: {{ scope.row.drive && scope.row.drive.name }}</div>
                    <div class="one-row">• Hộp số: {{ scope.row.gear && scope.row.gear.name }}</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="one-row">• Xuất xứ: {{ scope.row.origin && scope.row.origin.source }}</div>
                    <div class="one-row">• Phiên bản: {{ scope.row.version }}</div>
                    <div class="one-row">• Dung tích xi lanh: {{ scope.row.cc }}</div>
                    <div class="one-row">• Mã lực: {{ scope.row.horsePower }}</div>
                    <div class="one-row">• Mô-men xoắn: {{ scope.row.torque }}</div>
                    <div class="one-row">• Kích thước: {{ scope.row.size }}</div>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <!--          <el-table-column label="Ghi chú" prop="note" align="center" min-width="50"></el-table-column>-->
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
          <el-table-column
            align="center" label="Tác vụ" width="120" fixed="right"
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
              <el-tooltip content="Xóa" placement="top">
                <el-popconfirm
                  style="margin-left: 5px; margin-right: 5px"
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
import ModelCarAPI from "@/api/modelCarApi"
import moment from 'moment'
import TablePagination from "@/components/TablePagination"
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import { handleSearchInTable } from "@/utils"
import SearchColumn from "@/components/SearchColumn"

moment.locale('vi')
export default {
  name: "ModelCar",
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    return {
      url: `${config.api.domainCar}/carTemplate`,
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
          label: 'Tên model xe',
          prop: 'name',
          minWidth: '120',
        },
      ],
      columnsMap: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '150',
        },
      ],
      loading: false,
      form: {},
      dialogFormVisible: false,
    }
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleAdd() {
      this.$router.push('/quan-ly-model-xe/model-xe/0')
    },
    showDetails(prams) {
      this.form = prams
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.$router.push('/quan-ly-model-xe/model-xe/' + row._id)
    },
    async handleDelete(prams) {
      try {
        this.loading = true
        await ModelCarAPI.delete(prams._id)
        this.loading = false
        this.$refs.tableData.refreshData('del')
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

<style lang="scss">
.one-row {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
