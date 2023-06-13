<template>
  <div v-loading="loadingNews" class="news-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :search-params="searchParams"
      :search-form="searchForm"
      :is-search-date-range="false"
    >
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
          <el-table-column label="Hình ảnh" prop="thumbnail" align="center" min-width="100">
            <template slot-scope="scope">
              <img :src="`${config.api.domainUpload}/${scope.row.thumbnail}`" alt="Chưa có ảnh"
                   style="width:80px; height: auto"
              >
            </template>
          </el-table-column>

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
          <el-table-column label="Loại tin tức" min-width="100px">
            <template slot-scope="scope">
              <div v-for="item in scope.row.category" style="">
                <li>{{ item.name }}</li>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Tags" min-width="100px">
            <template slot-scope="scope">
              <div class="tag-overflow">
                <div v-for="item in scope.row.tags">
                  <li>{{ item.name }}</li>
                </div>
              </div>
              <div
                style="width: 100%; align-items: center; justify-content: center; display: flex; font-weight: bold"
                v-if="scope.row.tags && scope.row.tags.length > 0">
                {{scope.row.tags.length}} tags
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Tin nổi bật" min-width="70px">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.isOutstanding === 1">
                Tin nổi bật
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Xem nhiều" min-width="70px">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.isManyViewed === 1">
                Xem nhiều
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" align="center" label="Ngày cập nhật" min-width="100" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.updatedAt ? formatTime(scope.row.updatedAt, '{h}:{i} ngày {d}-{m}-{y}') : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="Người tạo" align="center" min-width="50"></el-table-column>
          <el-table-column align="center" label="Tác vụ" width="180" min-width="130px" fixed="right">
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
import NewsAPI from "@/api/newsApi"
import TablePagination from '@/components/TablePagination/index'
import { handleSearchInTable, parseTime } from '@/utils'
import config from "@/utils/config"
import SearchColumn from "@/components/SearchColumn"

export default {
  name: 'ManageNews',
  components: {
    TablePagination,
    SearchColumn,
  },
  data() {
    return {
      IdObject: '',
      config,
      url: `${config.api.news}`,
      searchForm: {},
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
      columnsMap: [
        {
          label: 'Tiêu đề',
          prop: 'title',
          minWidth: '150',
        },
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '90',
        },
      ],
      loadingNews: false,
      urlUpload: config.api.upload
    }
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleEdit(row) {
      this.$router.push('/quan-ly-tin-tuc/tin-tuc/' + row._id)
    },
    handleAddNews() {
      this.$router.push('/quan-ly-tin-tuc/tin-tuc/0')
    },
    handNewsType() {
      this.$router.push('/quan-ly-tin-tuc/loai-tin-tuc')
    },

    formatTime(timeStamp, format) {
      return parseTime(timeStamp, format)
    },
    async handleDel(id) {
      await NewsAPI.delete(id)
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
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>
