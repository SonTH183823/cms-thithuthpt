<template>
  <div class="app-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :search-form="searchForm"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          Thêm popup mới
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
            :index="indexMethod"
          />
          <template v-for="column in columnsMap">
            <search-column
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column label="Hình ảnh" align="center" min-width="250">
            <template slot-scope="scope">
              <img
                style="height: 100%; width: 100%;min-height: 140px; max-height: 250px; object-fit: contain"
                :src="`${config.api.domainUpload}/${scope.row.image}`"
              />
            </template>
          </el-table-column>
          <template v-for="column in columnsMap2">
            <search-column
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :prop-config="column.propConfig"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column label="Hiển thị sau x(s)" align="center" min-width="80">
            <template slot-scope="scope">
              <div>{{ scope.row.displayTime }} s</div>
            </template>
          </el-table-column>
          <el-table-column label="Link" align="center" min-width="150">
            <template slot-scope="scope">
              <a
                :href="scope.row.url"
                target="_blank"
                style="text-decoration: underline; font-style: italic; color: #0A9F46"
              >{{ scope.row.url }}</a>
            </template>
          </el-table-column>
          <template v-for="column in columnsMap1">
            <search-column
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column align="center" label="Tác vụ" min-width="100">
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
import moment from 'moment'
import TablePagination from "@/components/TablePagination"
import SearchColumn from "@/components/SearchColumn"
import { handleSearchInTable } from "@/utils"
import PopupAPI from "@/api/popupApi"

moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn,
  },
  data() {
    return {
      screen: this.$router.currentRoute.query.screen,
      position: this.$router.currentRoute.query.position,
      url: `${config.api.popup}`,
      config,
      urlUploadFile: config.api.upload,
      loading: false,
      searchForm: {},
      columnsMap1: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '100',
        },
      ],
      columnsMap2: [
        {
          label: 'Màn hình',
          prop: 'screen',
          type: 'config',
          propConfig: 'listScreens',
          minWidth: '100',
        },
      ],
      columnsMap: [
        {
          label: 'Tên Popup',
          prop: 'name',
          minWidth: '100'
        },
      ],
    }
  },
  methods: {
    handleAdd() {
      this.$router.push('/quan-ly-popup/chi-tiet/0')
    },
    handleEdit(row) {
      this.$router.push('/quan-ly-popup/chi-tiet/' + row._id)
    },
    async handleDelete(popup) {
      try {
        this.loading = true
        await PopupAPI.delete(popup._id)
        this.loading = false
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        this.loading = false
      }
    },
    indexMethod(index) {
      return index + 1
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
  }
}
</script>

