<template>
  <div style="margin-top: 20px">
    <div class="header-list">
      <div style="font-weight: bold">
        Ngày thống kê:
        <el-date-picker
          v-model="dateRange"
          format="dd - MM - yyyy"
          style="width: 100%; max-width: 400px"
          :picker-options="pickerOptions"
          type="daterange"
          range-separator="đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          :clearable="false"
        >
        </el-date-picker>
      </div>
      <a-button
        class="btn-import"
        style="height: 100%; background-color: #1BAF21; margin-left: 20px"
        @click="refeshTime"
      >
        <i class="el-icon-refresh" style="margin-right: 5px"/>
        Làm mới
      </a-button>
      <el-button style="position: absolute; right:20px" type="primary" @click="handelBack">
        Xong
      </el-button>
    </div>
    <div
      v-if="loading"
      style=" display: flex; flex: 1; height: 80vh; width: 100%; align-items: center; justify-content: center;"
    >
      <i class="el-icon-loading" style="margin-right: 5px; color: black"/>
      Đang tải...
    </div>
    <div
      v-else
      :key="index"
      class="chart-wrapper"
    >
      <div style="height: 360px; margin-top: 30px">
        <ChartComponents
          :options-bar="optionsBarFrom"
          :options-pie="optionsPieFrom"
          :series="seriesFrom"
          title="Thống kê theo nguồn nhận lead"
          :day-start="Math.floor(dayStart /1000)"
          :day-end="Math.floor(dayEnd /1000)"
          type-form="buyFrom"
        />
      </div>
      <div style="height: 360px; margin-top: 30px; margin-bottom: 30px">
        <ChartComponents
          :options-bar="optionsBarState"
          :options-pie="optionsPieState"
          :series="seriesState"
          title="Thống kê theo trạng thái lead"
          :day-start="Math.floor(dayStart /1000)"
          :day-end="Math.floor(dayEnd /1000)"
          type-form="buyState"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BuyCarCustomerAPI from "@/api/buyCarCustomer"
import ChartComponents from '../ChartComponents'
import config from "@/utils/config"

export default {
  name: "StatisticalBuyCar",
  components: {
    ChartComponents
  },
  data() {
    const date = new Date()
    return {
      loading: false,
      dateRange: [],
      pickerOptions: {
        disabledDate(time) {
          const now = new Date()
          return time.getTime() > now
        },
      },
      optionsPieFrom: {
        labels: [],
      },
      optionsBarFrom: {
        xaxis: {
          categories: [],
        },
      },
      seriesFrom: [{
        name: 'Số lượng',
        data: [],
      }],
      optionsPieState: {
        labels: [],
      },
      optionsBarState: {
        xaxis: {
          categories: [],
        },
      },
      seriesState: [{
        name: 'Số lượng',
        data: [],
      }],
      allow: {
        fromOther: 1,
        state: 2
      },
      dayStart: new Date(date.getFullYear(), date.getMonth(), 1),
      dayEnd: new Date(),
      listFromOther: [],
      listState: [],
      index: 0,
    }
  },
  watch: {
    dateRange: {
      handler: async function(val) {
        this.dayStart = val[0]
        this.dayEnd = val[1]
        if (this.dateRange.length === 2) {
          this.refeshData()
          await this.getLeadStatistical({
            dayStart: Math.floor(this.dayStart / 1000),
            dayEnd: Math.floor(this.dayEnd / 1000),
            allow: this.allow.state
          })
          await this.getLeadStatistical({
            dayStart: Math.floor(this.dayStart / 1000),
            dayEnd: Math.floor(this.dayEnd / 1000),
            allow: this.allow.fromOther
          })
        }
        this.keyIndex()
      },
      immediate: false,
      deep: false
    }
  },
  async mounted() {
    this.loading = true
    this.dateRange.push(this.dayStart)
    this.dateRange.push(this.dayEnd)
    this.loading = false
  },
  methods: {
    async getLeadStatistical(params) {
      this.loading = true
      const res = await BuyCarCustomerAPI.getStatistic(params)
      if (params.allow === this.allow.fromOther) {
        this.listFromOther = res
        if (this.listFromOther.length > 0) {
          this.listFromOther.map(item => {
            if (typeof item.from === 'string') {
              this.optionsBarFrom.xaxis.categories.push(item.from)
              this.optionsPieFrom.labels.push(item.from)
            } else {
              this.optionsBarFrom.xaxis.categories.push(config.from[item.from - 1].label)
              this.optionsPieFrom.labels.push(config.from[item.from - 1].label)
            }
            this.seriesFrom[0].data.push(item.total)
          })
        }
      } else {
        this.listState = res
        if (this.listState.length > 0) {
          this.listState.map(item => {
            if (typeof item.from === 'string') {
              this.optionsBarState.xaxis.categories.push(item.from)
              this.optionsPieState.labels.push(item.from)
            } else {
              this.optionsBarState.xaxis.categories.push(config.state[item.from - 1].label)
              this.optionsPieState.labels.push(config.state[item.from - 1].label)
            }
            this.seriesState[0].data.push(item.total)
          })
        }
      }
      this.loading = false
    },
    refeshData() {
      this.optionsBarFrom.xaxis.categories = []
      this.optionsPieFrom.labels = []
      this.optionsBarState.xaxis.categories = []
      this.optionsPieState.labels = []
      this.seriesFrom[0].data = []
      this.seriesState[0].data = []
    },
    async refeshTime() {
      this.refeshData()
      const date = new Date()
      this.dayStart = new Date(date.getFullYear(), date.getMonth(), 1)
      this.dayEnd = date
      this.dateRange = [this.dayStart, this.dayEnd]
    },
    handelBack() {
      this.$router.push('/quan-ly-khach-hang/danh-sach-mua-xe')
    },
    keyIndex() {
      this.index += 1
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  width: 100%;
  padding-right: 20px;

}

.header-list {
  display: flex;
  flex-direction: row;
  padding-left: 30px;
  height: 40px;

  .btn-import {
    border: unset !important;
    color: white !important;

    :hover :active {
      color: white !important;
      outline: none !important;
      box-shadow: unset !important;
      border: unset !important;
    }
  }

  .ant-btn:hover, .ant-btn:active, .ant-btn:focus {
    color: white !important;
  }
}
</style>
