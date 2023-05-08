<template>
  <div v-loading="loadingNews" class="news-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button size="small" type="primary" @click="handleAdd">
          Thêm mới
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          :default-sort="{ prop: 'name', order: 'ascending' }"
          border
          resizable
          :data="scope.tableData"
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="STT"
            align="center"
            fixed="left"
          />
          <el-table-column label="Tên trang chính sách" min-width="100px" prop="name" align="center"></el-table-column>
          <el-table-column label="Nội dung" min-width="300px" prop="content" align="center">
            <template slot-scope="scope">
              <div class="tag-overflow">
                <div v-html="scope.row.content.replace(/<img[^>]*>/g,'')"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" align="center" label="Ngày chỉnh sửa cuối" min-width="100" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.updatedAt ? formatTime(scope.row.updatedAt, '{h}:{i} ngày {d}-{m}-{y}') : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="Người chỉnh sửa cuối" align="center" min-width="100">
            <template slot-scope="scope">
              {{ (scope.row.createdBy && scope.row.createdBy.username) ? scope.row.createdBy.username : '' }}
            </template>
          </el-table-column>
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
          <el-table-column align="center" label="Tác vụ" width="150" min-width="150px" fixed="right">
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
                  @onConfirm="handleDel(scope.row._id)"
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
import TablePagination from '@/components/TablePagination/index'
import { handleSearchInTable, parseTime } from '@/utils'
import config from "@/utils/config"
import SalePolicyAPI from "@/api/salePolicyApi"
import SearchColumn from "@/components/SearchColumn"

export default {
  name: 'ManageNews',
  components: {
    TablePagination,
    SearchColumn,
  },
  data() {
    return {
      dialogVisibleSEO: false,
      IdObject: '',
      config,
      url: `${config.api.domainSalePolicy}/policy`,
      columnsMap: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '90',
        },
      ],
      loadingNews: false,
    }
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleEdit(row) {
      this.$router.push('/chinh-sach-ban-hang/chi-tiet/' + row._id)
    },
    handleAdd() {
      this.$router.push('/chinh-sach-ban-hang/chi-tiet/0')
    },
    handNewsType() {
      this.$router.push('/chinh-sach-ban-hang/danh-sach')
    },

    formatTime(timeStamp, format) {
      return parseTime(timeStamp, format)
    },
    async handleDel(id) {
      await SalePolicyAPI.delete(id)
      await this.$refs.tableData.refreshData('del')
    },
  }
}
</script>

<style lang="scss">
.news-container {
  padding: 20px;
}

.tag-overflow {
  max-height: 100px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>
