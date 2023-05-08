<template>
  <div v-loading="loadingCategory" class="news-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false"
    >

      <template slot="action">
        <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%">
          <el-button size="small" type="primary" @click="addNewType">
            Thêm mới điểm
          </el-button>
          <div style="display: flex; flex-direction: row; width: 350px; align-items: center">
            <div style="font-weight: bold; width: 90px">Lọc vị trí</div>
            <el-select
              v-model="searchPosition"
              filterable
              clearable
              placeholder="Chọn vị trí"
            >
              <el-option
                v-for="item in listPosition"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          :data="scope.tableData"
          border
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="STT"
            align="center"
            fixed="left"
          />
          <el-table-column align="center" property="name" label="Điểm kiểm định" min-width="200px" sortable
          ></el-table-column>
          <el-table-column align="center" label="Danh mục vị trí" min-width="200px">
            <template slot-scope="scope">
              <div v-if="scope.row.positionId && scope.row.positionId.name">{{ scope.row.positionId.name }}</div>
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
              <el-tooltip content="Xóa" placement="top">
                <el-popconfirm
                  style="margin-left: 5px"
                  confirm-button-text="Đồng ý"
                  cancel-button-text="Hủy"
                  title="Bạn có chắc chắn xóa?"
                  @onConfirm="handleDel(scope.row)"
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
      :title="formTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form ref="formSubmit" :rules="formRules" :model="formSubmit" label-position="top">
        <el-form-item sortable class="banner-attri" label="Kích hoạt" prop="active">
          <el-switch v-model="formSubmit.active" :active-value="1" :inactive-value="0" active-color="#13ce66"
                     style="margin-right: 10px;"
          />
        </el-form-item>
        <el-form-item label="Điểm kiểm định" prop="name">
          <el-input name="name" ref="name" v-model="formSubmit.name"></el-input>
        </el-form-item>
        <el-form-item class="category-form" label="Vị trí" prop="positionId">
          <el-select
            style="display: flex; width: 100%"
            v-model="formSubmit.positionId"
            placeholder="Lựa chọn vị trí kiểm định"
            filterable
          >
            <el-option
              v-for="item in listPosition"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">Hủy</el-button>
        <el-button type="primary" @click="handleSave()">Lưu</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>

import config from "@/utils/config"
import TablePagination from '@/components/TablePagination/index'
import { validText } from "@/utils/validate"
import { handleSearchInTable } from "@/utils"
import PointAPI from "@/api/pointApi"
import SearchColumn from "@/components/SearchColumn"

export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đầy đủ trường'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      dialogVisibleSEO: false,
      IdObject: '',
      isOutStanding: false,
      formSubmit: {
        name: '',
        positionId: '',
        active: 1
      },
      formRules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: 'Trường này không thể bỏ trống',
          validator: validateText
        }],
        positionId: [{
          required: true,
          trigger: 'blur',
          message: 'Trường này không thể bỏ trống',
          validator: validateText
        }],
      },
      loadingCategory: false,
      formTitle: '',
      formType: 'add',
      columnsMap: [
        {
          label: 'Ngày tạo',
          prop: 'createdAt',
          type: 'date',
          minWidth: '80',
        },
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '80',
        },
      ],
      config,
      url: `${config.api.domainPointCar}/point`,
      listPosition: [],
      searchPosition: '',
    }
  },
  watch: {
    searchPosition: {
      handler: function(val) {
        if (val !== '') {
          this.$refs.tableData.getData({
            positionId: val
          })
        } else {
          this.$refs.tableData.getData()
        }
      },
      immediate: false,
      deep: false
    }
  },
  mounted() {
    this.getPosition()
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async getPosition() {
      const data = await PointAPI.getPosition({ perPage: 10000 })
      this.listPosition = data.data
    },
    addNewType() {
      this.formType = 'add'
      this.formSubmit = {
        name: '',
        positionId: '',
        active: 1
      }
      this.formTitle = 'Thêm mới điểm'
      this.dialogVisible = true
    },
    handleEdit(item) {
      this.formType = 'update'
      this.formTitle = 'Cập nhật điểm'
      this.formSubmit = { ...item }
      this.formSubmit.positionId = item.positionId._id
      this.dialogVisible = true
    },
    async handleDel(item) {
      await PointAPI.delete(item._id)
      await this.$refs.tableData.refreshData('del')
    },
    handleClose() {
      this.formSubmit = {}
      this.dialogVisible = false
    },
    async handleSave() {
      const dataSubmit = {
        ...this.formSubmit
      }
      await this.$refs['formSubmit'].validate(async valid => {
        if (this.formSubmit.name.length === 0) {
          valid = false
        }
        if (valid) {
          if (this.formType === 'add') {
            await PointAPI.create(dataSubmit)
            await this.$refs.tableData.refreshData()
          } else {
            await PointAPI.update(dataSubmit._id, dataSubmit)
            await this.$refs.tableData.refreshData('edit')
          }
          this.formSubmit = {}
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style scoped>
.news-container {
  padding: 20px;
}
</style>
