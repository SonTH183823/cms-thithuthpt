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
      <el-table-column label="Môn học" prop="screen" align="center" min-width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.label }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Số chuyên đề" prop="screen" align="center" min-width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.label }}</div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
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
      tableData: []
    }
  },

  mounted() {
    this.tableDataSubject.map((item, index) => {
      this.tableData.push(item)
    })
  },

  methods: {
    async handleViewDetails(row) {
      this.$router.push({
        path: '/quan-ly-mon-hoc/danh-sach-cac-phan',
        query: { subject: row.value }
      })
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>

