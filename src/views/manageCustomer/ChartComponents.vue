<template>
  <div style="height: 100%; width: 100%">
    <h2 style="font-weight: bold; height: 5%; margin-left: 30px">{{ title }}</h2>
    <div v-if="total > 0" style=" display: flex; height: 95%;  width: 100%;">
      <div style=" width: 100%;height: 90%;">
        <apexchart type="pie" :options="optionsPie" :series="series[0].data" width="100%" height="100%"/>
        <div class="text-des">
          <div style="width: 90%; text-align: center ">
            {{ descriptionPie }}
            <span style="font-weight: bold">{{ startDay.toString() }}</span> đến
            <span style="font-weight: bold">{{ endDay.toString() }}</span>
          </div>
        </div>
      </div>
      <div style=" width: 100%;height: 90%;">
        <div class="text-des">
          <h3 style="width: 80%; text-align: center; font-weight: bold ">
            Tổng cộng: {{ total }} lead KH
            {{ typeForm.slice(0,3) === 'buy' ? 'mua' : 'bán' }} xe
          </h3>
        </div>
        <apexchart type="bar" :options="optionsBar" :series="series" width="100%" height="90%"/>
        <div class="text-des">
          <div style="width: 90%; text-align: center ">
            {{ descriptionBar }}
            <span style="font-weight: bold">{{ startDay.toString() }}</span> đến
            <span style="font-weight: bold">{{ endDay.toString() }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <img
        src="../../assets/images/no-data.png"
        width="auto" height="350px"
        alt=""
        style="object-fit: cover;border-radius: 5px;"
      />
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts"
import moment from "moment"

export default {
  name: "ChartComponents",
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    typeForm: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Thống kê theo nguồn nhận lead'
    },
    optionsPie: {
      type: Object,
      required: true
    },
    optionsBar: {
      type: Object,
      required: true
    },
    series: {
      type: Array,
      required: true
    },
    dayStart: {
      type: Number,
      required: true,
    },
    dayEnd: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      colors: ['#49A9E5', '#FF9331', '#60C552', '#F66548', '#1EBAB9', '#FFC239', '#D3427B', '#A3A3A3'],
      startDay: '',
      endDay: '',
      descriptionPie: '',
      descriptionBar: '',
      total: this.series[0].data.reduce((partialSum, a) => partialSum + a, 0)
    }
  },
  watch: {
    dayStart: {
      handler: function(val) {
        this.startDay = this.formatTime(val)
      },
      immediate: false,
      deep: true
    },
    dayEnd: {
      handler: function(val) {
        this.endDay = this.formatTime(val)
      },
      immediate: false,
      deep: true
    },
    typeForm: {
    }
  },
  mounted() {
    this.genDesForm(this.typeForm)
    this.startDay = this.formatTime(this.dayStart)
    this.endDay = this.formatTime(this.dayEnd)
    this.optionsPie.colors = this.colors
    this.optionsBar.colors = this.colors
    this.optionsBar.plotOptions = {
      bar: {
        distributed: true,
        columnWidth: '30px',
      }
    }
    this.optionsBar.dataLabels = {
      enabled: true
    }
    this.optionsBar.legend = {
      show: false
    }
  },
  methods: {
    formatTime(time) {
      return moment(time * 1000).format('DD - MM - YYYY')
    },
    genDesForm(val) {
      switch (val) {
        case 'buyFrom':
          this.descriptionPie = 'Biểu đồ thể hiện tỷ lệ lead KH mua xe theo nguồn nhận trong giai đoạn từ'
          this.descriptionBar = 'Biểu đồ thể hiện số lượng lead KH mua xe theo nguồn nhận trong giai đoạn từ'
          break
        case 'buyState':
          this.descriptionPie = 'Biểu đồ thể hiện tỷ lệ lead KH mua xe theo trạng thái trong giai đoạn từ'
          this.descriptionBar = 'Biểu đồ thể hiện số lượng lead KH mua xe theo trạng thái trong giai đoạn từ'
          break
        case 'saleFrom':
          this.descriptionPie = 'Biểu đồ thể hiện tỷ lệ lead KH bán xe theo nguồn nhận trong giai đoạn từ'
          this.descriptionBar = 'Biểu đồ thể hiện số lượng lead KH bán xe theo nguồn nhận trong giai đoạn từ'
          break
        case 'saleState':
          this.descriptionPie = 'Biểu đồ thể hiện tỷ lệ lead KH bán xe theo trạng thái trong giai đoạn từ'
          this.descriptionBar = 'Biểu đồ thể hiện số lượng lead KH bán xe theo trạng thái trong giai đoạn từ'
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.one-row {
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
}

.text-des {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
</style>
