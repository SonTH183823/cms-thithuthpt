<template>
  <div class="app-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          Thêm đề thi Toeic mới
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
          <el-table-column label="Tên" prop="title" align="center" min-width="200"></el-table-column>
          <el-table-column label="Hình ảnh" prop="thumbnail" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.thumbnail"
                style="width:80px; height: auto"
                :src="`${config.api.domainUpload}/${scope.row.thumbnail}`"
              />
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
          <el-table-column label="Thời gian làm bài (phút)" prop="time" align="center" min-width="80"></el-table-column>
          <el-table-column label="Số câu hỏi" prop="createdBy" align="center" min-width="50">
            <template slot-scope="scope">
              <div>{{ scope.row.questionIds.length }}</div>
            </template>
          </el-table-column>
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
            align="center" label="Tác vụ" width="220" fixed="right"
          >
            <template slot-scope="scope">
              <el-tooltip content="Sửa" placement="left">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handleEdit(scope.row)"
                >
                  <i class="el-icon-edit"/>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Biên tập câu hỏi Listening" placement="top">
                <el-button
                  style="margin-left: 5px; margin-right: 5px"
                  type="warning"
                  size="mini"
                  @click="handleEditQuestion(scope.row, 'Listening')"
                >
                  <i class="el-icon-headset"/>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Biên tập câu hỏi Reading" placement="bottom">
                <el-button
                  style="margin-left: 5px; margin-right: 5px"
                  type="success"
                  size="mini"
                  @click="handleEditQuestion(scope.row, 'Reading')"
                >
                  <i class="el-icon-question"/>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Xóa" placement="top">
                <el-popconfirm
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
import TablePagination from "@/components/TablePagination"
import SearchColumn from "@/components/SearchColumn"
import ExamAPI from "@/api/examApi"
import {handleSearchInTable} from "@/utils"

export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    return {
      url: `${config.api.toeic}`,
      config,
      columnsMap: [
        {
          label: 'Phân loại',
          prop: 'cateToeic',
          minWidth: '60',
          type: 'config',
          propConfig: 'caeToeicConfig'
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
        await ExamAPI.delete(prams._id)
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        console.log(err)
      }
    },
    indexMethod(index) {
      return index + 1
    },
    handleEdit(row) {
      this.$router.push('/quan-ly-toeic/de-thi/' + row._id)
    },
    handleEditQuestion(row, type) {
      this.$router.push('/quan-ly-toeic/cau-hoi/' + row._id + '?type=' + type)
    },
    handleAdd() {
      this.$router.push('/quan-ly-toeic/de-thi/0')
    },
  }
}
</script>

