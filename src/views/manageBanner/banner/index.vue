<template>
  <div class="app-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :search-params="searchParams"
      :search-form="searchForm"
      :is-search-date-range="false">
      <template slot="action">
        <el-button
          type="primary"
          plain
          size="medium"
          @click="handleBack"
          icon="el-icon-back"
        >
          Quay lại
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="handleAddBanner"
        >
          Thêm banner mới
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
          <el-table-column label="Hình ảnh banner" align="center" min-width="300">
            <template slot-scope="scope">
              <img
                style="height: 100%; width: 100%;min-height: 140px; max-height: 300px; object-fit: contain"
                :src="`${config.api.domainUpload}/${scope.row.image_url}`"/>
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
          <<el-table-column label="Ghi chú" prop="note" align="center" min-width="150"></el-table-column>
          <el-table-column
            align="center" label="Tác vụ" min-width="120">
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
import BannerAPI from "@/api/bannerApi"
import moment from 'moment'
import { validText} from "@/utils/validate"
import TablePagination from "@/components/TablePagination";
import SearchColumn from "@/components/SearchColumn"
import {handleSearchInTable} from "@/utils"

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
      url: `${config.api.banner}?screen=${this.$router.currentRoute.query.screen}&position=${this.$router.currentRoute.query.position}`,
      config,
      urlUploadFile: config.api.upload,
      loadingBanner: false,
      searchForm: {},
      searchParams: [
        {
          label: 'Tiêu đề',
          value: 'title',
        },
        {
          label: 'Mô tả',
          value: 'description',
        }
      ],
      columnsMap1: [
        {
          label: 'Link',
          prop: 'link',
          minWidth: '120',
        },
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '120',
        },
      ],
      columnsMap: [
        {
          label: 'Thứ tự',
          prop: 'rank',
          minWidth: '70'
        },
        {
          label: 'Tiêu đề',
          prop: 'title',
          minWidth: '100'
        },
        {
          label: 'Nội dung',
          prop: 'description',
          minWidth: '150'
        },
        {
          label: 'Tên Button',
          prop: 'button',
          minWidth: '100'
        },
      ],
    }
  },
  methods: {
    handleAddBanner() {
      this.$router.push({ path: '/quan-ly-banner/banner/0', query: { screen: this.screen, position: this.position }})
    },
    handleBack() {
      this.$router.push('/quan-ly-banner/vi-tri')
    },
    handleEdit(row) {
      this.$router.push({ path: '/quan-ly-banner/banner/' + row._id , query: { screen: this.screen, position: this.position }})
    },
    async handleDelete(banners) {
      try {
        this.loadingBanner = true
        await BannerAPI.delete(banners._id)
        this.loadingBanner = false
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        this.loadingBanner = false
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

