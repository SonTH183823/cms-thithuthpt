<template>
  <div class="app-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :search-params="searchParams"
      :is-search-date-range="false">
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleMultiEdit"
          :disabled="multipleSelection.length < 1"
        >
          Chỉnh sửa trạng thái xe đã chọn
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          border
          resizable
          :data="scope.tableData"
          style="width: 100%; font-size: 0.8rem; overflow: auto;"
          :height="`calc(100vh - 180px)`"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="STT"
            align="center"
            fixed="left"
          />
          <el-table-column
            label="Ảnh"
            align="center"
            fixed="left"
            min-width="160"
          >
            <template slot-scope="scope">
              <img :src="config.api.domainUpload + '/' + scope.row.imgCover" alt="" style="max-height: 100px; aspect-ratio: 4/3">
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
          <el-table-column label="Ghi chú" prop="note" align="center" min-width="150"></el-table-column>
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
<!--              <el-tooltip content="Cấu hình SEO" placement="top">-->
<!--                <el-button-->
<!--                  type="warning"-->
<!--                  size="mini"-->
<!--                  plain-->
<!--                  @click="handleSEO(scope.row._id)"-->
<!--                >-->
<!--                  <i class="el-icon-search"/>-->
<!--                </el-button>-->
<!--              </el-tooltip>-->
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-pagination>
    <el-dialog
      title="Chỉnh sửa trạng thái xe"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal=false
      width="40%"
    >
      <el-form ref="form" :model="form" label-width="60px" label-position="top">
        <el-form-item
          label="Trạng thái"
          label-width="150px"
        >
          <el-select v-model="form.status" placeholder="Chọn trạng thái (mặc định chưa bán)">
            <el-option
              v-for="(item, index) in config.statusMyCar"
              :disabled="index < 2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <DialogOwnSEO
      :dialog-form-visible="dialogVisibleSEO"
      :id-object="IdObject"
      target-type="carId"
      @update-visiable-seo="onUpdateVisiableSEO"
    />
  </div>
</template>

<script>
import config from '@/utils/config'
import TablePagination from "@/components/TablePagination"
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import {handleSearchInTable} from "@/utils";
import SearchColumn from "@/components/SearchColumn";
import CarAPI from '@/api/carApi'
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
      url: `${config.api.domainCar}/car?copied=1`,
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
      columnsMap1: [
        {
          label: 'Tên xe',
          prop: 'name',
          minWidth: '120',
        },
        {
          label: 'Trạng thái xe ảo',
          prop: 'status',
          propConfig: 'statusMyCar',
          type: 'config',
          minWidth: '150',
        },
      ],
      columnsMap: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '150',
        },
      ],
      loading: false,
      tableData: [],
      form: {
        status: 1
      },
      editId: 0,
      dialogFormVisible: false,
      multipleSelection: [],
      ids: [],
      listStatus: [],
      dialogVisibleSEO: false,
      IdObject: '',
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleMultiEdit() {
      this.editId = 0
      // this.form.status = 1
      this.dialogFormVisible = true
      this.ids = []
      this.listStatus = []
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.form.status = ''
      this.ids = []
      this.listStatus = []
      this.editId = ''
    },
    onUpdateVisiableSEO(e) {
      this.dialogVisibleSEO = e.data.visible
    },
    async handleSubmit() {
      if (!this.form.status) {
        this.form.status = 1
      }
      if (this.editId === 0) {
        this.multipleSelection.map((item) => {
          this.ids.push(item._id)
        })
        this.listStatus = Array(this.ids.length).fill(this.form.status)
        const dataSubmit = {
          ids: this.ids,
          status: this.listStatus
        }
        await CarAPI.updateStatus(dataSubmit)
      } else {
        const dataSubmit = {
          ids: [this.editId],
          status: [this.form.status]
        }
        await CarAPI.updateStatus(dataSubmit)
      }
      this.$refs.tableData.refreshData('edit')
      this.form.status = ''
      this.listStatus = []
      this.ids = []
      this.editId = ''
      this.dialogFormVisible = false
    },
    handleEdit(row) {
      this.editId = row._id
      this.form.status = row.status
      this.dialogFormVisible = true
    },
    handleSEO(id) {
      this.IdObject = id
      this.dialogVisibleSEO = true
    },
  }
}
</script>

<style scoped>

</style>
