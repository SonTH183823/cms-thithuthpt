<!--hãng xe-->
<template>
  <div v-loading="loadingManufacturer" class="app-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false">
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          Thêm hãng xe mới
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
            min-width="50"
            :index="indexMethod"
          />
          <el-table-column label="Tên hãng xe" prop="name" align="center" min-width="120"></el-table-column>
          <el-table-column label="Hình ảnh logo" prop="logo" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.logo"
                style="width:80px; height: auto"
                :src="`${config.api.domainUpload}/${scope.row.logo}`"/>
            </template>
          </el-table-column>
          <el-table-column label="Ghi chú" prop="note" align="center" min-width="150"></el-table-column>
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
            align="center" label="Tác vụ" width="180" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="Sửa" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handleEdit(scope.row)">
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
import ManufacturerAPI from "@/api/properties/manufacturerApi"
import moment from 'moment'
import TablePagination from "@/components/TablePagination"
import {handleSearchInTable} from "@/utils";
import SearchColumn from "@/components/SearchColumn";

moment.locale('vi')
export default {
  name: "Manufacturer",
  components: {
    TablePagination,
    SearchColumn,
  },
  data() {
    return {
      fileList: [],
      loading: false,
      url: `${config.api.domainCar}/manufacturer`,
      config,
      columnsMap: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '100',
        },
      ],
      loadingManufacturer: false,
    }
  },

  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleAdd() {
      this.$router.push('/quan-ly-thuoc-tinh/hang-xe/0')
    },
    async handleEdit(prams) {
      this.$router.push('/quan-ly-thuoc-tinh/hang-xe/' + prams._id)
    },
    async handleDelete(prams) {
      try {
        this.loadingManufacturer = true
        await ManufacturerAPI.delete(prams._id)
        this.loadingManufacturer = false
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        this.loadingManufacturer = false
      }
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>
