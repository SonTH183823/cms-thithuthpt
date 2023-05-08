<template>
  <div v-loading="loadingNews" class="news-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :search-form="searchForm"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button size="medium" type="primary" @click="handleAddNews">
          Thêm tin mới
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
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
          <el-table-column align="center" label="Lĩnh vực tuyển dụng" min-width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.category && scope.row.category.name">{{ scope.row.category.name }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Địa điểm làm việc" min-width="80px">
            <template slot-scope="scope">
              <div>
                {{ provinces[scope.row.address].name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="timeEnd" align="center" label="Thời hạn ứng tuyển" min-width="100" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.timeEnd ? formatTime(scope.row.timeEnd, '{h}:{i} ngày {d}-{m}-{y}') : '' }}</span>
            </template>
          </el-table-column>
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
          <el-table-column align="center" label="Tác vụ" width="180" min-width="150px" fixed="right">
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
              <el-tooltip content="Cấu hình SEO" placement="top">
                <el-button
                  type="warning"
                  size="mini"
                  plain
                  @click="handleSEO(scope.row._id)"
                >
                  <i class="el-icon-search"/>
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
    <DialogOwnSEO
      :dialog-form-visible="dialogVisibleSEO"
      :id-object="IdObject"
      target-type="recruitId"
      @update-visiable-seo="onUpdateVisiableSEO"
    />
  </div>
</template>

<script>
import RecruitmentAPI from "@/api/recruitmentApi"
import TablePagination from '@/components/TablePagination/index'
import { handleSearchInTable, parseTime } from '@/utils'
import config from "@/utils/config"
import SearchColumn from "@/components/SearchColumn"
import provinces from "@/views/managerRecruitment/provinces"
import DialogOwnSEO from "@/views/manageSEO/dialogOwnSEO"

export default {
  components: {
    TablePagination,
    SearchColumn,
    DialogOwnSEO
  },
  data() {
    return {
      config,
      provinces,
      url: `${config.api.domainRecruitment}/recruit`,
      searchForm: {},
      columnsMap: [
        {
          label: 'Vị trí',
          prop: 'title',
          minWidth: '150',
        },
        {
          label: 'Hình thức làm việc',
          prop: 'workingForm',
          type: 'config',
          minWidth: '80',
        },
      ],
      columnsMap1: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '90',
        },
      ],
      loadingNews: false,
      dialogVisibleSEO: false,
      IdObject: ''
    }
  },
  methods: {
    onUpdateVisiableSEO(e) {
      this.dialogVisibleSEO = e.data.visible
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleEdit(row) {
      this.$router.push('/quan-ly-tuyen-dung/tin-tuyen-dung/' + row._id)
    },
    handleAddNews() {
      this.$router.push('/quan-ly-tuyen-dung/tin-tuyen-dung/0')
    },

    formatTime(timeStamp, format) {
      return parseTime(timeStamp, format)
    },
    handleSEO(id) {
      this.IdObject = id
      this.dialogVisibleSEO = true
    },
    async handleDel(id) {
      try {
        this.loadingNews = true
        await RecruitmentAPI.delete(id)
        this.loadingNews = false
        await this.$refs.tableData.refreshData('del')
      } catch (e) {
        this.loadingNews = false
      }
    },
  }
}
</script>

<style lang="scss">
.news-container {
  padding: 20px;
}

</style>
