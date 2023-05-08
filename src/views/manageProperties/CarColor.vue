<template>
  <div class="app-container">
    <el-dialog
      :title="formType ==='create' ? 'Thêm màu xe mới' : 'Chỉnh sửa màu xe'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal=false
      width="60%"
    >
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-form-item class="banner-attri" label="Màu xe" prop="color">
          <el-input v-model="form.color"></el-input>
        </el-form-item>
        <el-form-item class="banner-attri" label="Mã màu" prop="colorCode">
          <div style="display: flex; flex-direction: row">
            <el-input v-model="form.colorCode" readonly style="margin-right: 10px"></el-input>
            <el-color-picker v-model="form.colorCode"></el-color-picker>
          </div>
        </el-form-item>

        <el-form-item class="banner-attri" label="Ghi chú" prop="note">
          <el-input v-model="form.note"></el-input>
        </el-form-item>
        <el-form-item sortable class="banner-attri" label="Kích hoạt">
          <el-switch v-model="form.active" :active-value="1" :inactive-value="0" active-color="#13ce66"
                     style="margin-right: 10px;"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
          Thêm màu xe mới
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
          <el-table-column label="Màu xe" prop="color" align="center" min-width="120"></el-table-column>
          <el-table-column label="Mã màu" prop="colorCode" align="center" min-width="120">
            <template slot-scope="scope">
              <div class="el-row--flex is-justify-center is-align-middle">
                {{ scope.row.colorCode }}
                <div v-if="scope.row.colorCode" class="color-div" :style="{ backgroundColor: scope.row.colorCode }" />
                <div v-else>Không có mã màu</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Ghi chú" prop="note" align="center" min-width="150"></el-table-column>
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
          <el-table-column
            align="center" label="Tác vụ" width="150" fixed="right">
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
import ColorAPI from "@/api/properties/colorApi";
import moment from 'moment'
import { validText } from "@/utils/validate"
import TablePagination from "@/components/TablePagination"
import {handleSearchInTable} from "@/utils";
import SearchColumn from "@/components/SearchColumn";

moment.locale('vi')
export default {
  name: "CarColor",
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    const token = localStorage.getItem(config.tokenKey)
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đủ trường'))
      } else {
        callback()
      }
    }
    return {
      url: `${config.api.domainCar}/color`,
      config,
      listCarCompany: [],
      headerUpload: {
        'x-access-token': token
      },
      server: {
        url: `${config.api.upload}`,
        process: {
          method: 'POST',
          header: {'x-access-token': token},
        },
      },
      columnsMap: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '100',
        },
      ],
      activeList: [
        {
          value: 0,
          label: 'CHƯA KÍCH HOẠT',
          type: 'info'
        },
        {
          value: 1,
          label: 'ĐANG KÍCH HOẠT',
          type: 'success'
        }
      ],
      loading: false,
      tableData: [],
      form: {
        color: '',
        colorCode: '#fff',
        note: '',
        active: 1
      },
      formRules: {
        color: [{required: true, trigger: 'blur', validator: validateText}],
        colorCode: [{required: true, trigger: 'blur', message: 'Vui lòng nhập đủ trường'}],
        active: [{required: true, trigger: 'blur', validator: validateText}],
      },
      formType: '',
      dialogFormVisible: false,
    }
  },

  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async onChangeActive(data) {
      const d = await ColorAPI.getById(data.id)
      const dataSubmit = {
        ...d,
      }
      try {
        this.loading = true
        await ColorAPI.update(data.id, dataSubmit)
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    handleAdd() {
      this.formType = 'create'
      this.dialogFormVisible = true
      this.form = {
        note: '',
        color: '',
        colorCode: '#fff',
        active: 1
      }
    },
    handleEdit(prams) {
      this.formType = 'edit'
      this.form = {
        _id: prams._id,
        note: prams.note,
        color: prams.color,
        colorCode: prams.colorCode,
        active: prams.active
      }
      this.dialogFormVisible = true
    },
    async handleDelete(prams) {
      try {
        this.loading = true
        await ColorAPI.delete(prams._id)
        this.loading = false
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        this.loading = false
      }
    },
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          switch (this.formType) {
            case 'create':
              await ColorAPI.create({
                ...this.form,
              })
              this.$refs.tableData.refreshData()
              this.form = {}
              this.dialogFormVisible = false
              break
            case 'edit':
              // eslint-disable-next-line no-case-declarations
              const dataSubmit = {
                ...this.form,
              }
              delete dataSubmit._id
              await ColorAPI.update(this.form._id, dataSubmit)
              this.$refs.tableData.refreshData('edit')
              this.form = {}
              this.dialogFormVisible = false
              break
          }
          // eslint-disable-next-line no-sequences
          this.form = {}
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.form = {}
      this.logo = {}
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

<style lang="scss">
.color-div {
  height: 40px;
  width: 40px;
  margin-left: 5px;
  aspect-ratio: 1/1;
  border-radius: 5px;
  display: block;
  border: #C0C4CC 1px solid;
}

</style>
