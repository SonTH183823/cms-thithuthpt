<template>
  <div v-loading="loadingNews" class="news-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false">
      <template slot="action">
        <el-button size="small" type="primary" @click="handleAddNews">
          Thêm mới
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          :default-sort="{ prop: 'name', order: 'ascending' }"
          border
          :data="scope.tableData"
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="#"
            align="center"
            fixed="left"
          />
          <el-table-column label="Tên" prop="name" align="center" min-width="120"></el-table-column>
          <el-table-column label="Hình ảnh" prop="thumbnail" align="center" min-width="200">
            <template slot-scope="scope">
              <img :src="`${config.api.domainUpload}/${scope.row.logo}`" alt="Chưa có ảnh"
                   style="width:80px; height: auto">
            </template>
          </el-table-column>
          <el-table-column align="center" property="description" label="Mô tả" min-width="240px"></el-table-column>
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

          <el-table-column align="center" label="Tác vụ" width="180" min-width="150px" fixed="right">
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
import PartnerApi from "@/api/partnerApi"
import TablePagination from '@/components/TablePagination/index'
import {handleSearchInTable, parseTime} from '@/utils'
import config from "@/utils/config"
import SearchColumn from "@/components/SearchColumn"

export default {
  name: 'ManageNews',
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    return {
      config,
      url: `${config.api.partner}`,
      columnsMap: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '120',
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
      this.$router.push('/quan-ly-doi-tac/doi-tac/' + row._id)
    },
    handleAddNews() {
      this.$router.push('/quan-ly-doi-tac/doi-tac/0')
    },
    formatTime(timeStamp, format) {
      return parseTime(timeStamp, format)
    },
    async handleDel(id) {
      await PartnerApi.delete(id)
      await this.$refs.tableData.refreshData('del')
    },
  }
}
</script>

<style lang="scss">
.news-container {
  padding: 20px;
}

//.cell {
//  text-align: center;
//}
</style>
