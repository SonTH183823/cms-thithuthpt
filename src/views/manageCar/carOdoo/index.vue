<template>
  <div class="app-container">
    <div style="display:flex; justify-content: flex-end">
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-check"
        @click="handleBack"
      >Xong
      </el-button>
    </div>
    <el-tabs value="first">
      <el-tab-pane name="first">
        <span slot="label" style="font-weight: bold">Xe đã có Media</span>
        <table-pagination
          ref="tableData"
          :url="urlHasMedia"
          :is-search-date-range="false"
        >
          <template slot="table" slot-scope="scope">
            <el-table
              v-loading="scope.isLoading"
              border
              :data="scope.tableData"
              style="width: 100%; font-size: 0.8rem; overflow: auto;"
              :height="`calc(100vh - 245px)`"
            >
              <el-table-column
                type="index"
                label="STT"
                align="center"
                fixed="left"
              />
              <el-table-column label="OdooID" align="center" min-width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.carOdooId.odooId">
                    {{ scope.row.carOdooId.odooId }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="Tên xe" align="center" min-width="200">
                <template slot-scope="scope">
                  <div v-if="scope.row.carOdooId.name">
                    {{ scope.row.carOdooId.name }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="Biển số xe" align="center" min-width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.carOdooId.licensePlates">
                    {{ scope.row.carOdooId.licensePlates }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="Tỉnh thành" align="center" min-width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.carOdooId.province">
                    {{ scope.row.carOdooId.province }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="Năm SX" align="center" min-width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.carOdooId.year">
                    {{ scope.row.carOdooId.year }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="Trạng thái Odoo"
                align="center"
                min-width="160"
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.carOdooId.state" :type="config.status[scope.row.carOdooId.state - 7].typeTag">
                    {{ config.status[scope.row.carOdooId.state - 7].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Tác vụ" width="120" fixed="right">
                <template slot-scope="scope">
                  <el-tooltip content="Thêm thông tin xe" placement="top">
                    <el-button
                      type="primary"
                      size="mini"
                      plain
                      @click="handleEdit(scope.row)"
                    >
                      <i class="el-icon-plus"/>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </table-pagination>

      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label" style="font-weight: bold">Xe có sẵn từ Odoo</span>
        <table-pagination
          ref="tableData"
          :url="url"
          :is-search-date-range="false"
        >
          <template slot="table" slot-scope="scope">
            <el-table
              v-loading="scope.isLoading"
              border
              :data="scope.tableData"
              style="width: 100%; font-size: 0.8rem; overflow: auto;"
              :height="`calc(100vh - 245px)`"
            >
              <el-table-column
                type="index"
                label="STT"
                align="center"
                fixed="left"
              />
              <el-table-column label="OdooID" align="center" width="80" prop="odooId"></el-table-column>
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
              <el-table-column
                label="Hãng xe"
                align="center"
                min-width="160"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.manufacturerId && scope.row.manufacturerId.name">
                    {{ scope.row.manufacturerId.name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="Dòng xe"
                align="center"
                min-width="160"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.brandId && scope.row.brandId.name">{{ scope.row.brandId.name }}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="Trạng thái Odoo"
                align="center"
                width="160"
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.state" :type="config.status[scope.row.state - 7].typeTag">
                    {{ config.status[scope.row.state - 7].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center" label="Tác vụ" width="100" fixed="right"
              >
                <template slot-scope="scope">
                  <el-tooltip content="Thêm xe" placement="top">
                    <el-button
                      type="warning"
                      size="mini"
                      plain
                      @click="handleAddNewCarOdoo(scope.row)"
                    >
                      <i class="el-icon-plus"/>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </table-pagination>
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
import CarAPI from '@/api/carApi'

moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    return {
      config,
      url: `${config.api.domainCar}/carOdoo/notCreated`,
      urlHasMedia: `${config.api.domainCar}/media`,
      columnsMap: [
        {
          label: 'Tên xe',
          prop: 'name',
          minWidth: '120',
        },
        {
          label: 'Biển số xe',
          prop: 'licensePlates',
          minWidth: '90',
        },
        {
          label: 'Chi nhánh',
          prop: 'branch',
          minWidth: '80',
        },
        {
          label: 'Năm SX',
          prop: 'year',
          minWidth: '60',
        },
        {
          label: 'Số khung',
          prop: 'vinNumber',
          minWidth: '120',
        },
      ],
      loading: false,
      form: {},

    }
  },

  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleBack() {
      this.$router.push('/quan-ly-xe/danh-sach')
    },
    handleEdit(row) {
      this.$router.push('/quan-ly-xe/chi-tiet-xe-odoo/' + row._id)
    },
    handleAddNewCarOdoo(row) {
      this.$router.push('/quan-ly-xe/them-media-xe-odoo/' + row._id)
    },
    async handleDelete(prams) {
      try {
        this.loading = true
        await CarAPI.delete(prams._id)
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
