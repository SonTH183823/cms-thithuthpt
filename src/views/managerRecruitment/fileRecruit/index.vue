<template>
  <div class="app-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false"
    >
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          border
          resizable
          :data="scope.tableData"
          style="width: 100%; font-size: 0.8rem; overflow: auto;"
          :height="`calc(100vh - 150px)`"
        >
          <el-table-column
            type="index"
            label="STT"
            align="center"
            fixed="left"
          />
          <el-table-column align="center" label="Lĩnh vực" min-width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.category && scope.row.category.name">{{ scope.row.category.name }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Vị trí" min-width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.recruit && scope.row.recruit.title">{{ scope.row.recruit.title }}</div>
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
          <el-table-column label="Địa chỉ làm việc" align="center" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.recruit && scope.row.recruit.address !== undefined">
                {{ provinces[scope.row.recruit.address].name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Hồ sơ" align="center" min-width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.cv">
                <div>{{ scope.row.cv }}</div>
                <a class="btn-link-cv"
                   :href="`${config.api.domainUploadFile}/${scope.row.cv}`"
                   target="_blank"
                >Xem chi tiết</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Phương thức liên lạc" align="center" min-width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.phone">Số điện thoại: {{ scope.row.phone }}<br/></div>
              <div v-if="scope.row.email">Email: {{ scope.row.email }}</div>
            </template>
          </el-table-column>
          <template v-for="column in columnsMap1">
            <search-column
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :prop-config="column.propConfig"
              :min-width="column.minWidth"
              :is-children="column.isChildren"
              :parent-prop="column.parentProp"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column
            align="center" label="Tác vụ" width="120" fixed="right"
          >
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
                  style="margin-left: 5px; margin-right: 5px"
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
    <el-dialog
      title="Chỉnh sửa trạng thái"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal=false
      :before-close="handleCancel"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="60px" label-position="top">
        <el-form-item
          label="Trạng thái"
          label-width="150px"
        >
          <el-select v-model="form.status" placeholder="Chọn trạng thái">
            <el-option
              v-for="item in config.statusCV"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import config from '@/utils/config'
import moment from 'moment'
import provinces from "@/views/managerRecruitment/provinces"
import TablePagination from "@/components/TablePagination"
import { handleSearchInTable } from "@/utils"
import SearchColumn from "@/components/SearchColumn"
import RecruitmentAPI from "@/api/recruitmentApi"

moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    return {
      config,
      url: `${config.api.domainRecruitment}/application`,
      provinces,
      columnsMap: [
        {
          label: 'Họ Tên',
          prop: 'name',
          minWidth: '100',
        },
      ],
      columnsMap1: [
        {
          label: 'Trạng thái',
          prop: 'status',
          type: 'config',
          minWidth: '100',
          propConfig: 'statusCV'
        },
      ],
      form: {
        status: ''
      },
      dialogFormVisible: false,
    }
  },

  methods: {
    formatTime(time) {
      return moment(time * 1000).format('hh:mm A [ngày] DD - MM - YYYY')
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async handleSubmit() {
      const dataSubmit = {
        ...this.form,
        status: this.form.status,
        category: this.form.category._id,
        recruit: this.form.recruit._id
      }
      delete dataSubmit._id
      await RecruitmentAPI.updateApplication(dataSubmit, this.form._id)
      await this.$refs.tableData.refreshData('edit')
      this.form = {}
      this.dialogFormVisible = false
    },
    handleCancel() {
      this.form = {}
      this.dialogFormVisible = false
    },
    handleEdit(params) {
      this.form = { ...params }
      this.dialogFormVisible = true
    },
    async handleDelete(prams) {
      try {
        await RecruitmentAPI.deleteApplication(prams._id)
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        console.log(err)
      }
    },
  }
}
</script>

<style lang="scss">
.one-row {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 8px 0;
}

.btn-link-cv {
  color: #0A9F46;
  font-style: italic;
  font-weight: bold;

  :hover {
    color: red;
  }
}
</style>

