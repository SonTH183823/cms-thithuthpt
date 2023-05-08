<!--<template>-->
<!--  <div class="dashboard-container">-->
<!--    <el-row type="flex" justify="space-around">-->
<!--      <el-card class="box-card" shadow="always" style="text-align: center;">-->
<!--        <el-row><h2 style="font-size: 2rem">Tổng sản phẩm</h2></el-row>-->
<!--        <el-row><h3 style="font-size: 1.6rem;color: #118bca; margin: 0">{{ totalProduct }}</h3></el-row>-->
<!--      </el-card>-->
<!--      <el-card class="box-card" shadow="always" style="text-align: center;">-->
<!--        <el-row><h2 style="font-size: 2rem">Tổng đơn hàng</h2></el-row>-->
<!--        <el-row><h3 style="font-size: 1.6rem;color: #118bca; margin: 0">{{ totalOrder }}</h3></el-row>-->
<!--      </el-card>-->
<!--    </el-row>-->
<!--    <el-row style="margin-top: 30px" type="flex" justify="center">-->
<!--      <el-card class="box-card" shadow="always" style="width: 90%">-->
<!--        <el-row><h2 style="margin-top: 8px;">Đơn hàng gần đây</h2></el-row>-->
<!--        <el-table-->
<!--          border-->
<!--          :data="tableData"-->
<!--          v-loading="loadingOrderDashboard"-->
<!--          style="width: 100%; font-size: 0.8rem;"-->
<!--          size="mini"-->
<!--          height="50vh"-->
<!--        >-->
<!--          <el-table-column prop="codeId" label="Mã đơn hàng" width="80">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.code }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="customer" label="Khách hàng" min-width="100">-->
<!--            <template slot-scope="scope">-->
<!--              <i class="el-icon-user-solid"></i>-->
<!--              <span class="customer-link" @click="gotoUserDetail(scope.row)">-->
<!--                {{ scope.row.customer.full_name }}-->
<!--              </span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="phone" label="Số điện thoại" min-width="80">-->
<!--            <template slot-scope="scope">-->
<!--              {{ scope.row.customer.phone }}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="address" label="Địa chỉ" min-width="110">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.address }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="status" label="Trạng thái" min-width="100">-->
<!--            <template slot-scope="scope">-->
<!--              <div-->
<!--                v-for="itemStatus in statusList"-->
<!--                :key="itemStatus.value"-->
<!--              >-->
<!--                <el-tag-->
<!--                  v-if="scope.row.status === itemStatus.value"-->
<!--                  :type="itemStatus.type"-->
<!--                  size="small"-->
<!--                >-->
<!--                  {{ itemStatus.label }}-->
<!--                </el-tag>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="products" label="Tổng" min-width="70">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ formatPrice(sum(scope.row.products)) }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="placedAt" label="Ngày tạo" min-width="120">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ formatTime(scope.row.createAt) }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column class-name="right-action-table" label="Tác vụ" align="center" fixed="right" min-width="50">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button type="text" class="btn-open" @click="gotoOrderDetail(scope.row)">-->
<!--                <i class="el-icon-view"  />-->
<!--                <span></span>-->
<!--              </el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--      </el-card>-->
<!--    </el-row>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import ProductAPI from "@/api/productApi"-->
<!--import OrderAPI from "@/api/orderApi"-->
<!--import moment from "moment"-->
<!--import config from "@/utils/config"-->

<!--export default {-->
<!--  name: 'Dashboard',-->
<!--  data() {-->
<!--    return {-->
<!--      totalProduct: '',-->
<!--      totalOrder: '',-->
<!--      tableData: [],-->
<!--      statusList: [-->
<!--        {-->
<!--          value: 1,-->
<!--          type: 'warning',-->
<!--          label: 'CHỜ XÁC NHẬN'-->
<!--        },-->
<!--        {-->
<!--          value: 2,-->
<!--          type: 'success',-->
<!--          label: 'ĐÃ XÁC NHẬN'-->
<!--        },-->
<!--        {-->
<!--          value: 3,-->
<!--          type: 'warning',-->
<!--          label: 'ĐANG GIAO HÀNG'-->
<!--        },-->
<!--        {-->
<!--          value: 4,-->
<!--          type: 'success',-->
<!--          label: 'ĐÃ GIAO HÀNG'-->
<!--        },-->
<!--        {-->
<!--          value: 5,-->
<!--          type: 'success',-->
<!--          label: 'ĐÃ HOÀN THÀNH'-->
<!--        },-->
<!--        {-->
<!--          value: 6,-->
<!--          type: 'danger',-->
<!--          label: 'TRẢ HÀNG/HOÀN TIỀN'-->
<!--        },-->
<!--        {-->
<!--          value: 7,-->
<!--          type: 'danger',-->
<!--          label: 'ĐÃ HỦY'-->
<!--        },-->
<!--      ],-->
<!--      loadingOrderDashboard: false,-->
<!--      uid: this.$route.query.id,-->
<!--      typeTable: '',-->
<!--      keyTable: 1,-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.loadProduct()-->
<!--    this.loadOrder()-->
<!--  },-->
<!--  watch: {-->
<!--    $route: {-->
<!--      handler: async function(newVal, oldVal) {-->
<!--        if (newVal.query.id) {-->
<!--          this.url = `${config.api.order}?user=${this.uid}`-->
<!--          this.keyTable++-->
<!--        } else {-->
<!--          this.url = config.api.order-->
<!--          this.keyTable++-->
<!--        }-->
<!--      },-->
<!--      immediate: true-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    gotoUserDetail(data) {-->
<!--      this.$router.push('/quan-ly/don-hang?id=' + data._id)-->
<!--      this.typeTable = 'user'-->
<!--    },-->
<!--    gotoOrderDetail(data) {-->
<!--      this.$router.push('/quan-ly/don-hang/' + data._id)-->
<!--    },-->
<!--    setDataTable(data) {-->
<!--      this.tableData = data.map(item => {-->
<!--        // item.min_price = undefined-->
<!--        return {-->
<!--          ...item-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    async loadProduct() {-->
<!--      const { total } = await ProductAPI.get({ type: 1 })-->
<!--      this.totalProduct = total-->
<!--    },-->
<!--    async loadOrder() {-->
<!--      try {-->
<!--        this.loadingOrderDashboard = true-->
<!--        const { total, data } = await OrderAPI.get()-->
<!--        this.setDataTable(data)-->
<!--        this.totalOrder = total-->
<!--        this.loadingOrderDashboard = false-->
<!--      } catch (err) {-->
<!--        this.loadingOrderDashboard = false-->
<!--      }-->
<!--    },-->
<!--    formatPrice(value) {-->
<!--      const val = (value / 1).toFixed(0).replace(',', '.')-->
<!--      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")-->
<!--    },-->
<!--    formatTime(unix) {-->
<!--      return moment.unix(unix).format('LLL')-->
<!--    },-->
<!--    sum(item) {-->
<!--      const total = item.reduce((previousValue, currentValue) => {-->
<!--        return previousValue + currentValue.total_price-->
<!--      }, 0)-->
<!--      return total-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss">-->
<!--.dashboard-container {-->
<!--  padding: 20px;-->
<!--}-->

<!--.box-card {-->
<!--  width: 40%;-->
<!--  padding: 10px;-->
<!--}-->


<!--</style>-->
