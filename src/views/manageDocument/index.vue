<template>
  <div class="app-container">
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
          Thêm tài liệu mới
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
          <el-table-column label="Tên" prop="title" align="center" min-width="150"></el-table-column>
          <el-table-column label="Hình ảnh" prop="thumbnail" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.thumbnail"
                style="width:80px; height: auto"
                :src="`${config.api.domainUpload}/${scope.row.thumbnail}`"/>
            </template>
          </el-table-column>
          <el-table-column label="Link tài liệu" prop="link" align="center" min-width="200">
            <template slot-scope="scope">
              <a :href="scope.row.link" target="_blank" style="font-style: italic; color: #02967D; text-decoration: underline">
                {{ scope.row.link }}
              </a>
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
              :prop-config="column.propConfig"
            />
          </template>
          <el-table-column label="Người tạo" prop="createdBy" align="center" min-width="60"></el-table-column>
          <template v-for="column in columnsMap1">
            <search-column
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
              :prop-config="column.propConfig"
            />
          </template>
          <el-table-column
            align="center" label="Tác vụ" width="150" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="Sửa" placement="left">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handleEdit(scope.row)">
                  <i class="el-icon-edit"/>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Xóa" placement="right">
                <el-popconfirm
                  confirm-button-text="Đồng ý"
                  cancel-button-text="Hủy"
                  title="Bạn có chắc chắn xóa?"
                  @onConfirm="handleDelete(scope.row)"
                >
                  <el-button
                    style="margin-left: 5px"
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
import TablePagination from "@/components/TablePagination"
import SearchColumn from "@/components/SearchColumn";
import ExamAPI from "@/api/examApi";
import {handleSearchInTable} from "@/utils";
import DocumentAPI from "@/api/documentApi";

export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    return {
      url: config.api.document,
      config,
      columnsMap: [
        {
          label: 'Môn học',
          prop: 'subject',
          type: 'config',
          minWidth: '90',
          propConfig: 'subjectConfig'
        },
        {
          label: 'Đánh giá (sao)',
          prop: 'rate',
          minWidth: '60',
        },
      ],
      columnsMap1: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '80',
        },
      ],
    }
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async handleDelete(prams) {
      try {
          await DocumentAPI.delete(prams._id)
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        console.log(err)
      }
    },
    indexMethod(index) {
      return index + 1
    },
    handleEdit(row) {
      this.$router.push('/quan-ly-tai-lieu/tai-lieu/' + row._id)
    },
    handleAdd() {
      this.$router.push('/quan-ly-tai-lieu/tai-lieu/0')
    },
  }
}
</script>

