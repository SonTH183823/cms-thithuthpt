<template>
  <div class="app-container">
    <table-pagination
      ref="tableData"
      :url="url"
      :search-params="searchParams"
      :is-search-date-range="false">
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          border
          resizable
          :data="scope.tableData"
          style="width: 100%; font-size: 0.8rem; overflow: auto;"
          :height="`calc(100vh - 180px)`"
        >
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
              :min-width="column.minWidth"
              :is-children="column.isChildren"
              :parent-prop="column.parentProp"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column label="Tag" align="center" min-width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.tag" >
                <el-tag
                  style=" margin-bottom: 5px; margin-right: 5px"
                  v-for="tag in scope.row.tag"
                  :key="tag"
                  :type="config.tagCar[tag - 1].typeTag">
                  {{ config.tagCar[tag - 1].label }}
                </el-tag>
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
              :is-children="column.isChildren"
              :parent-prop="column.parentProp"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column
            align="center" label="Tác vụ" width="120" fixed="right">
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
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-pagination>
    <el-dialog
      title="Chỉnh sửa tag xe"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="40%"
    >
      <el-form ref="form" label-width="60px" label-position="top">
        <el-form-item
          label="Tag"
          label-width="150px"
        >
          <el-checkbox v-model="highlights">
            <el-tag type="danger">Nổi bật</el-tag>
          </el-checkbox>
          <el-checkbox v-model="seeMore">
            <el-tag type="warning">Xem nhiều</el-tag>
          </el-checkbox>
          <el-checkbox v-model="seaBeautiful" :disabled="true">
            <el-tag>Biển đẹp</el-tag>
          </el-checkbox>
          <el-checkbox v-model="seaBeautifulHN" :disabled="true">
            <el-tag>Biển HN đẹp</el-tag>
          </el-checkbox>
          <el-checkbox v-model="seaBeautifulHCM" :disabled="true">
            <el-tag>Biển HCM đẹp</el-tag>
          </el-checkbox>
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
import TablePagination from "@/components/TablePagination"
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import {handleSearchInTable} from "@/utils";
import SearchColumn from "@/components/SearchColumn";
import CarAPI from '@/api/carApi'
export default {
  components: {
    TablePagination,
    SearchColumn
  },
  data() {
    return {
      config,
      url: `${config.api.domainCar}/car`,
      searchParams: [
        {
          label: 'Tiêu đề',
          value: 'title',
        },
      ],
      columnsMap1: [
        {
          label: 'Tên xe',
          prop: 'name',
          minWidth: '150',
        },
      ],
      columnsMap: [
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '100',
        },
      ],
      loading: false,
      tableData: [],
      dialogFormVisible: false,
      tagCar: [],
      form: {},
      highlights: false,
      seeMore: false,
      seaBeautiful: false,
      seaBeautifulHN: false,
      seaBeautifulHCM: false
    }
  },

  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    async setDataTable(data) {
      this.tableData = data.map(item => {
        return {
          ...item,
          _id: item._id,
          note: item.note,
          logo: item.logo,
          name: item.name,
          active: item.active
        }
      })
    },
    resetFormData() {
      this.highlights = false
      this.seeMore = false
      this.seaBeautifulHCM = false
      this.seaBeautifulHN = false
      this.seaBeautiful = false
      this.tagCar = []
      this.form = {}
    },
    handleCancel() {
      this.resetFormData()
      this.dialogFormVisible = false
    },
    async handleSubmit() {
      if (this.highlights) this.tagCar.push(1)
      if (this.seeMore) this.tagCar.push(2)
      if (this.seaBeautiful) this.tagCar.push(3)
      if (this.seaBeautifulHCM) this.tagCar.push(5)
      if (this.seaBeautifulHN) this.tagCar.push(4)
      const dataSubmit = {
        ...this.form,
        carOdooId: this.form.carOdooId._id,
        color: this.form.color._id || this.form.color,
        attributes: {
          ...this.form.attributes,
          manufacturer: this.form.attributes.manufacturer._id || this.form.attributes.manufacturer,
          brand: this.form.attributes.brand._id || this.form.attributes.brand,
          drive: this.form.attributes.drive._id || this.form.attributes.drive,
          figure: this.form.attributes.figure._id || this.form.attributes.figure,
          fuel: this.form.attributes.fuel._id || this.form.attributes.fuel,
          gear: this.form.attributes.gear._id || this.form.attributes.gear,
          origin: this.form.attributes.origin._id || this.form.attributes.origin,
        },
        tag: this.tagCar
      }
      await CarAPI.update(this.form._id, dataSubmit)
      this.$refs.tableData.refreshData('edit')
      this.resetFormData()
      this.dialogFormVisible = false
    },
    handleEdit(row) {
      this.form = row
      row.tag?.map(item => {
        if (item === 1) this.highlights = true
        if (item === 2) this.seeMore = true
        if (item === 3) this.seaBeautiful = true
        if (item === 4) this.seaBeautifulHN = true
        if (item === 5) this.seaBeautifulHCM = true
      })
      this.dialogFormVisible = true
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

<style scoped>

</style>
