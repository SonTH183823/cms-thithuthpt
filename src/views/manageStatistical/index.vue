<template>
  <div class="app-container">
    <el-dialog
      :title="formType === 'create' ? 'Thêm thống kê mới' : 'Chỉnh sửa thống kê'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal=false
      width="40%"
    >
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-form-item class="banner-attri" label="Title" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item class="banner-attri" label="Subtitle" prop="subTitle">
          <el-input type="textarea" :rows="5" v-model="form.subTitle"></el-input>
        </el-form-item>
        <el-form-item class="banner-attri" label="Màn hình" prop="fromScreen">
          <el-select v-model="form.fromScreen" placeholder="Chọn màn hình">
            <el-option
              v-for="(item, index) in listScreens"
              :key="index"
              :label="item"
              :value="index + 1"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item sortable class="banner-attri" label="Kích hoạt" prop="active">
          <el-switch v-model="form.active" :active-value="1" :inactive-value="0" active-color="#13ce66"
                     style="margin-right: 10px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">{{ formType === 'create' ? 'Thêm mới' : 'Chỉnh sửa' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
          Thêm thống kê mới
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
            align="center" label="Tác vụ" width="180" fixed="right"
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
import { handleSearchInTable } from "@/utils"
import SearchColumn from "@/components/SearchColumn"
import StatisticalAPI from "@/api/statisticalApi"
import { validText } from "@/utils/validate"

moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đủ trường!'))
      } else {
        callback()
      }
    }
    return {
      url: `${config.api.domainStatistic}/statistic`,
      config,
      searchForm: {},
      columnsMap1: [
        {
          label: 'Title',
          prop: 'title',
          minWidth: '200',
        },
        {
          label: 'Subtitle',
          prop: 'subTitle',
          minWidth: '200',
        },
        {
          label: 'Màn hình',
          prop: 'fromScreen',
          type: 'config',
          minWidth: '100',
          propConfig: 'fromStatistical'
        },
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '100',
        },
      ],
      listScreens: ['Trang chủ', 'Trang bán xe'],
      form: {
        title: '',
        subTitle: '',
        fromScreen: 1,
        active: 1,
      },
      formRules: {
        title: [{ required: true, trigger: 'blur', validator: validateText }],
        subTitle: [{ required: true, trigger: 'blur', validator: validateText }],
        fromScreen: [{ required: true, trigger: 'blur', validator: validateText }],
      },
      dialogFormVisible: false,
      formType: '',
    }
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleEdit(prams) {
      this.formType = 'edit'
      this.form = {
        ...prams,
        fromScreen: prams.fromScreen ? prams.fromScreen : 1
      }
      this.dialogFormVisible = true
    },
    async handleDelete(prams) {
      try {
        await StatisticalAPI.delete(prams._id)
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        console.log(err)
      }
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.refreshData()
    },
    handleAdd() {
      this.formType = 'create'
      this.dialogFormVisible = true
    },
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.formType === 'create') {
            await StatisticalAPI.create(this.form)
            this.$refs.tableData.refreshData()
            this.refreshData()
          } else {
            await StatisticalAPI.update(this.form._id, this.form)
            this.$refs.tableData.refreshData('edit')
            this.refreshData()
          }
          this.dialogFormVisible = false
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    refreshData() {
      this.form = {
        title: '',
        subTitle: '',
        fromScreen: 1,
        active: 1,
      }
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

