<!--<template>-->
<!--  <div v-loading="loadingMenu" class="menu-container">-->
<!--    <table-pagination-->
<!--      ref="tableData"-->
<!--      :url="url"-->
<!--      :search-params="searchParams"-->
<!--      :search-form="searchForm"-->
<!--      :is-search-date-range="false">-->
<!--      <template slot="action">-->
<!--        <el-button size="small" type="primary" @click="handleAddMenu">-->
<!--          Thêm mới-->
<!--        </el-button>-->
<!--      </template>-->
<!--      <template slot="table" slot-scope="scope">-->
<!--        <el-table-->
<!--          v-loading="scope.isLoading"-->
<!--          :default-sort="{ prop: 'name', order: 'ascending' }"-->
<!--          border-->
<!--          resizable-->
<!--          :data="scope.tableData"-->
<!--          :height="`calc(100vh - 180px)`"-->
<!--        >-->
<!--          <el-table-column-->
<!--            type="index"-->
<!--            label="#"-->
<!--            align="center"-->
<!--            fixed="left"-->
<!--          />-->
<!--          <template v-for="column in columnsMap">-->
<!--            <search-column-->
<!--              :key="column.label"-->
<!--              :label="column.label"-->
<!--              :prop="column.prop"-->
<!--              :min-width="column.minWidth"-->
<!--              :type="column.type"-->
<!--              :typeTag="column.typeTag"-->
<!--              :fixed="column.fixed"-->
<!--              :search-remote="handleSearch"-->
<!--            />-->
<!--&lt;!&ndash;            <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;              sortable&ndash;&gt;-->
<!--&lt;!&ndash;              :key="column.label"&ndash;&gt;-->
<!--&lt;!&ndash;              :label="column.label"&ndash;&gt;-->
<!--&lt;!&ndash;              :prop="column.prop"&ndash;&gt;-->
<!--&lt;!&ndash;              :width="column.width"&ndash;&gt;-->
<!--&lt;!&ndash;            ></el-table-column>&ndash;&gt;-->
<!--          </template>-->

<!--&lt;!&ndash;          <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;            sortable&ndash;&gt;-->
<!--&lt;!&ndash;            label="Đường dẫn menu"&ndash;&gt;-->
<!--&lt;!&ndash;            prop="url"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;              <a :href="`${scope.row.url}`">{{scope.row.url}}</a>&ndash;&gt;-->
<!--&lt;!&ndash;            </template>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-table-column label="Kích hoạt" prop="active" width="180">&ndash;&gt;-->
<!--&lt;!&ndash;            <template slot-scope="scope">&ndash;&gt;-->  
<!--&lt;!&ndash;              <div v-for="activeItem in activeList" :key="activeItem.value">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-tag :type="activeItem.type" v-if="activeItem.value === scope.row.active">&ndash;&gt;-->
<!--&lt;!&ndash;                  {{ activeItem.label }}&ndash;&gt;-->
<!--&lt;!&ndash;                </el-tag>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </template>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-table-column label="Kích hoạt" prop="active" align="center" width="200">&ndash;&gt;-->
<!--&lt;!&ndash;            <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-switch v-model="scope.row.active" :active-value="1" :inactive-value="0" active-color="#13ce66" style="margin-right: 10px;" @change="onChangeActive(scope.row)"/>&ndash;&gt;-->
<!--&lt;!&ndash;            </template>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-table-column>&ndash;&gt;-->
<!--          <el-table-column align="center" label="Tác vụ" width="180" min-width="150px" fixed="right">-->
<!--            <template slot-scope="scope">-->
<!--              <el-tooltip content="Sửa" placement="top">-->
<!--                <el-button-->
<!--                  type="primary"-->
<!--                  size="mini"-->
<!--                  plain-->
<!--                  @click="handleEdit(scope.row)">-->
<!--                  <i class="el-icon-edit" />-->
<!--                </el-button>-->
<!--              </el-tooltip>-->
<!--              <el-tooltip content="Xóa" placement="top">-->
<!--                <el-popconfirm-->
<!--                  style="margin-left: 5px"-->
<!--                  confirm-button-text="Đồng ý"-->
<!--                  cancel-button-text="Hủy"-->
<!--                  title="Bạn có chắc chắn xóa?"-->
<!--                  @onConfirm="handleDel(scope.row._id)"-->
<!--                >-->
<!--                  <el-button-->
<!--                    slot="reference"-->
<!--                    type="danger"-->
<!--                    size="mini"-->
<!--                    icon="el-icon-delete"-->
<!--                  />-->
<!--                </el-popconfirm>-->
<!--              </el-tooltip>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--      </template>-->
<!--    </table-pagination>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import MenuAPI from "@/api/menuApi"-->
<!--import TablePagination from '@/components/TablePagination/index'-->
<!--import { handleSearchInTable } from '@/utils'-->
<!--import config from "@/utils/config"-->
<!--import SearchColumn from "@/components/SearchColumn"-->

<!--export default {-->
<!--  name: 'ManageMenu',-->
<!--  components: {-->
<!--    TablePagination,-->
<!--    SearchColumn-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      config,-->
<!--      url: `${config.api.menu}`,-->
<!--      searchForm: {},-->
<!--      searchParams: [-->
<!--        {-->
<!--          label: 'Tên menu',-->
<!--          value: 'name',-->
<!--        },-->
<!--        {-->
<!--          label: 'Tìm kiếm theo ngày',-->
<!--          type: 'date'-->
<!--        },-->
<!--      ],-->
<!--      columnsMap: [-->
<!--        {-->
<!--          label: 'Tên menu',-->
<!--          prop: 'name',-->
<!--        },-->
<!--        {-->
<!--          label: 'Thứ tự menu',-->
<!--          prop: 'rank',-->
<!--        },-->
<!--        {-->
<!--          label: 'Đường dẫn menu',-->
<!--          prop: 'url',-->
<!--          type: 'link'-->
<!--        },-->
<!--        {-->
<!--          label: 'Kích hoạt',-->
<!--          prop: 'active',-->
<!--          type: 'config',-->
<!--          minWidth: '120',-->
<!--        },-->
<!--      ],-->
<!--      activeList: [-->
<!--        {-->
<!--          value: 0,-->
<!--          label: 'CHƯA KÍCH HOẠT',-->
<!--          type: 'info'-->
<!--        },-->
<!--        {-->
<!--          value: 1,-->
<!--          label: 'ĐANG KÍCH HOẠT',-->
<!--          type: 'success'-->
<!--        }-->
<!--      ],-->
<!--      loadingMenu: false,-->
<!--      urlUpload: config.api.upload-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    async handleSearch(prop, value) {-->
<!--      handleSearchInTable(this, prop, value, 'remote')-->
<!--    },-->
<!--    handleFilterByResult(resultType) {-->
<!--      if (resultType) {-->
<!--        this.$refs.tableData.handleFilter({-->
<!--          ketQuaHienTai: resultType,-->
<!--        })-->
<!--      } else {-->
<!--        this.$refs.tableData.handleFilter()-->
<!--      }-->
<!--    },-->
<!--    async onChangeActive(dataCurrentMenu) {-->
<!--      console.log(dataCurrentMenu)-->
<!--      const data = await MenuAPI.getById(dataCurrentMenu._id)-->
<!--      const dataSubmit = {-->
<!--        ...data,-->
<!--        active: dataCurrentMenu.active-->
<!--      }-->
<!--      try {-->
<!--        this.loadingMenu = true-->
<!--        await MenuAPI.update(dataSubmit, dataCurrentMenu._id)-->
<!--        this.loadingMenu = false-->
<!--      } catch (err) {-->
<!--        this.loadingMenu = false-->
<!--      }-->
<!--    },-->
<!--    handleEdit(row) {-->
<!--      this.$router.push('/quan-ly/menu/' + row._id)-->
<!--    },-->
<!--    handleAddMenu() {-->
<!--      this.$router.push('/quan-ly/menu/0')-->
<!--    },-->
<!--    async handleDel(id) {-->
<!--      await MenuAPI.delete(id)-->
<!--      await this.$refs.tableData.refreshData()-->
<!--    },-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss">-->
<!--.menu-container {-->
<!--  padding: 20px;-->
<!--}-->
<!--</style>-->
