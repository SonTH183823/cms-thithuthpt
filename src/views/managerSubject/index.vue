<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      style="width: 100%;margin: auto;"
      stripe
    >
      <el-table-column
        type="index"
        label="STT"
        align="center"
        fixed="left"
        min-width="50"
        :index="indexMethod"
      />
      <el-table-column label="Màn hình" prop="screen" align="center" min-width="150">
        <template slot="header" slot-scope="scope">
          <div>Môn học</div>
        </template>
        <template slot-scope="scope">
          <div>{{ scope.row.label }}</div>
        </template>
      </el-table-column>
<!--      <el-table-column label="Vị trí" prop="screen" align="center" min-width="150">-->
<!--        <template slot="header" slot-scope="scope">-->
<!--          <div>Vị trí</div>-->
<!--          <el-select-->
<!--            v-model="positionSearch"-->
<!--            filterable-->
<!--            clearable-->
<!--            placeholder="Chọn vị trí"-->
<!--            size="small"-->
<!--            style="width: 20%"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in listPosition"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.label"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </template>-->

<!--        <template slot-scope="scope">-->
<!--          <div>{{ scope.row.position.label }}</div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        align="right"
      >
        <template slot="header">
          <el-button type="success" icon="el-icon-refresh" @click="handelRf">Làm mới</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="handleViewDetails(scope.row)"
          >
            <i class="el-icon-view" style="margin-right: 10px"/>Xem chi tiết
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import config from '@/utils/config'
import tableDataSubject from "@/views/managerSubject/tableData"

export default {
  data() {
    return {
      config,
      tableDataSubject,
      columnsMap: [
        {
          label: 'Màn hình',
          prop: 'label',
          parentProp: 'screen',
          isChildren: true,
          minWidth: '120',
        },
        {
          label: 'Vị trí',
          prop: 'label',
          parentProp: 'position',
          isChildren: true,
          minWidth: '120',
        },
      ],
      search: '',
      listScreens: [],
      screenSearch: '',
      positionSearch: '',
      listPosition: [{ label: 'Trên' }, { label: 'Giữa' }, { label: 'Dưới' }],
      tableData: []
    }
  },

  watch: {
    screenSearch: {
      handler: function(val) {
        this.handelSearch()
      },
      immediate: false,
      deep: true
    },
    positionSearch: {
      handler: function() {
        this.handelSearch()
      },
      immediate: false,
      deep: true
    }
  },

  mounted() {
    this.tableDataSubject.map((item, index) => {
      this.tableData.push(item)
      if (index % 3 === 0) {
        this.listScreens.push(item.screen)
      }
    })
  },

  methods: {
    async handleViewDetails(row) {
      this.$router.push({
        path: '/quan-ly-banner/danh-sach-banner',
        query: { screen: row.screen.value, position: row.position.value }
      })
    },
    handelRf() {
      this.positionSearch = ''
      this.screenSearch = ''
    },
    handelSearch() {
      this.tableData = []
      if (this.positionSearch && this.screenSearch) {
        this.tableDataSubject.map(item => {
          if (item.screen.label === this.screenSearch && item.position.label === this.positionSearch) {
            this.tableData.push(item)
          }
        })
      } else if (this.positionSearch && !this.screenSearch) {
        this.tableDataSubject.map(item => {
          if (item.position.label === this.positionSearch) {
            this.tableData.push(item)
          }
        })
      } else if (!this.positionSearch && this.screenSearch) {
        this.tableDataSubject.map(item => {
          if (item.screen.label === this.screenSearch) {
            this.tableData.push(item)
          }
        })
      } else {
        this.tableDataSubject.map((item, index) => {
          this.tableData.push(item)
        })
      }
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

