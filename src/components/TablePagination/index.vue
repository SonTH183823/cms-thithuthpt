<template>
  <div ref="tablePagination" class="table-pagination-wrap">
    <slot name="filter" :dataFilter="dataFilter" :table-data="tableData"/>
    <div v-if="!hideAction" class="action-box">
      <el-row>
        <el-col :span="24">
          <slot name="action" :table-data="tableData"/>
        </el-col>
        <el-col
          v-if="false"
          :span="16"
          :style="!isSearchDateRange ? 'position: absolute; right: -25%' : ''"
        >
          <el-row :gutter="5">
            <el-col v-if="false" :span="6">
              <el-select
                v-model="searchField"
                style="width: 100%"
                size="small"
                disabled
                clearable
                placeholder="Chọn mục tìm kiếm"
                default-first-option
                @change="handleSelectSearchParam"
              >
                <el-option
                  v-for="(option, idx) in searchParams"
                  :key="idx"
                  :value="JSON.stringify(option)"
                  :label="option.label"
                />
              </el-select>
            </el-col>
            <el-col v-if="false" :span="9">
              <el-input
                v-model="searchStr"
                :disabled="isSearchParam"
                clearable
                class="search-input"
                :placeholder="searchPlaceHolder"
                suffix-icon="el-icon-search"
                size="small"
                @input="searchParam ? handleSearch() : handleSearch('or')"
              />
            </el-col>
            <!--            <el-col :span="15" style="border: 1px solid white; height: 100%"></el-col>-->
            <el-col v-if="isSearchDateRange" :span="9">
              <el-date-picker
                format="dd/MM/yyyy"
                placeholder="Ngày/Tháng/Năm"
                v-model="dateTimeRange"
                class="date-range-box"
                size="small"
                type="daterange"
                align="right"
                start-placeholder="Từ"
                end-placeholder="Đến"
                :default-time="['00:00:00', '23:59:59']"
                @change="handleSelectTimeRange"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <slot name="table" :tableData="tableData" :isLoading="isLoading"/>
    <el-pagination
      v-if="isPagination && tableData.length > 0"
      class="pagination-box"
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 15, 20, 50, 100]"
      :page-size="perPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import moment from "moment"
import queryString from "querystring"
import request from "../../utils/request"

export default {
  name: "TablePagination",

  props: {
    url: {
      type: String,
      default: "",
      required: true,
    },
    numberPerPage: {
      type: Number,
      default: 10,
    },
    dataFilter: {
      type: Object,
      default() {
        return {}
      }
    },
    searchParams: {
      type: Array,
      default: function() {
        return []
      },
    },
    searchParamDefault: {
      type: String,
      default: "",
    },
    hideAction: {
      type: Boolean,
      default: false,
    },
    isPagination: {
      type: Boolean,
      default: true,
    },
    isSearchDateRange: {
      type: Boolean,
      default: true,
    },
    searchForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data(props) {
    return {
      timeoutSearch: null,
      isLoading: true,
      currentPage: 1,
      tableData: [],
      talbeDataConst: [],
      total: 0,
      searchStr: "",
      perPage: props.numberPerPage ? props.numberPerPage : 10,
      searchField: '',
      searchParam: "",
      searchPlaceHolder: "",
      dateTimeRange: "",
      isSearchParam: true,
      otherParams: {}
    }
  },
  created() {
    this.$bus.$on('reloadData', () => {
      this.getData()
    })
  },
  mounted() {
    this.getData()
  },
  destroyed() {
    this.$bus.$off('reloadData')
  },
  methods: {
    getData(params = {}) {
      this.isLoading = true
      const {
        page = params.page || 1,
        perPage = this.perPage,
        ...otherParams
      } = params
      if (Object.keys(otherParams).length > 0) {
        this.otherParams = { ...otherParams }
      } else {
        this.otherParams = {}
      }
      let charQuery = '?'
      if (this.url.includes('?')) {
        charQuery = '&'
      }

      const url = Object.keys(params).length > 0
        ? `${this.url}${charQuery}${queryString.stringify({
          page,
          perPage,
          ...otherParams
        })}`
        : this.url
      request({
        url,
        method: "get",
      })
        .then((res) => {
          this.isLoading = false

          if (res.data) {
            this.tableData = res.data ? res.data : []
            this.talbeDataConst = res.data
            this.total = res?.total
            this.perPage = res?.perPage
            this.currentPage = res?.page
          }
        })
        .catch((err) => {
          console.log(err)
          this.isLoading = false
          this.tableData = []
        })
    },
    handleSelectTimeRange(timeRange) {
      if (timeRange) {
        const timeFrom = moment(timeRange[0]).unix()
        const timeTo = moment(timeRange[1]).unix()

        let charQuery = '?'
        if (this.url.includes('?')) {
          charQuery = '&'
        }

        const url = `${this.url}${charQuery}startTime=${timeFrom}&endTime=${timeTo}`

        request({
          url: url,
          method: "get",
        })
          .then((res) => {
            this.isLoading = false

            if (res.data) {
              this.tableData = res.data
            }
          })
          .catch((err) => {
            console.log(err)
            this.isLoading = false
          })
      } else {
        this.getData({ ...this.otherParams })
      }
    },
    handleSelectSearchParam(param) {
      if (param) {
        const data = JSON.parse(param)
        this.isSearchParam = false
        if (data.type === 'date') {
          this.isSearchDateRange = true
          this.isSearchParam = true
          this.handleSearch("or")
        }

        this.searchParam = data.value
        this.searchPlaceHolder = "Tìm kiếm theo " + data.label
        this.handleSearch()
      } else {
        this.searchParam = ""
        this.searchPlaceHolder = "Tìm kiếm"
        this.handleSearch("or")
        this.isSearchDateRange = false
        this.isSearchParam = true
      }
    },
    handleSearch(queryType = "and") {
      this.isLoading = true
      console.log('search')
      const searchParams = this.searchParams.reduce(
        (accumulator, currentValue) => {
          return {
            ...accumulator,
            [currentValue.value]: this.searchStr,
          }
        },
        {}
      )
      let url = ""
      if (queryType && queryType === "or") {
        url = `${this.url}?queryType=${queryType}&${queryString.stringify(
          searchParams
        )}`
      } else {
        if (this.url.includes('?')) {
          url = `${this.url}&${this.searchParam}=${this.searchStr}`
        } else {
          url = `${this.url}?${this.searchParam}=${this.searchStr}`
        }
      }

      if (this.searchStr) {
        clearTimeout(this.timeoutSearch)
        this.timeoutSearch = setTimeout(() => {
          request({
            url,
            method: "get",
          })
            .then((res) => {
              this.isLoading = false

              if (res.data) {
                this.tableData = res.data
              }
            })
            .catch((err) => {
              console.log(err)
              this.isLoading = false
            })
        }, 10)
      } else {
        this.getData()
      }
    },
    handleFilter(params = {}, callback = () => {
    }) {
      const { ...otherParams } = params
      if (params) {
        this.getData({ ...otherParams })
        this.$router.push({
          query: {
            ...otherParams,
          },
        })
      } else {
        this.getData()
        this.$router.push({
          query: null,
        })
      }
      callback && callback()
    },
    handleSearchLocal() {
      Object.entries(this.searchForm).map(item => {
        if (item[1] === '') {
          delete this.searchForm[item[0]]
        }
      })

      if (Object.keys(this.searchForm).length > 0) {
        const objMap = Object.entries(this.searchForm)
        this.isLoading = true
        const searchData = this.talbeDataConst.filter(row => {
          let isTrue = null
          objMap.forEach(item => {
            let parentProp = ''
            let prop = ''
            let value = ''
            let valueSearch = ''

            if (item[0].includes('.')) {
              parentProp = item[0].split('.')[0]
              prop = item[0].split('.')[1]

              value = row[parentProp][prop].toString().toLowerCase()
            } else {
              if (row[item[0]]) {
                value = row[item[0]].toString().toLowerCase()
              } else {
                isTrue = false
              }
            }

            valueSearch = item[1].toString().toLowerCase()

            isTrue = value.includes(valueSearch)
          })
          return isTrue
        })
        this.isLoading = false
        this.tableData = [...searchData]
      } else {
        this.tableData = [...this.talbeDataConst]
      }
    },
    handleSizeChange(perPage) {
      this.perPage = perPage
      this.getData({ perPage, page: 1, ...this.searchForm, ...this.otherParams })
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getData({ page, ...this.searchForm, ...this.otherParams })
    },
    refreshData(type) {
      if (type === 'del') {
        if (this.total - this.perPage * (this.currentPage - 1) === 1) {
          this.currentPage -= 1
        }
        this.getData(
          {
            page: this.currentPage,
            perPage: this.perPage,
            ...this.searchForm,
            ...this.otherParams
          }
        )
      } else if (type === 'edit') {
        this.getData(
          {
            page: this.currentPage,
            perPage: this.perPage,
            ...this.searchForm,
            ...this.otherParams
          }
        )
      } else {
        this.getData(
          {
            page: 1,
            perPage: this.perPage,
            ...this.searchForm,
            ...this.otherParams
          }
        )
      }
    },
  },
}
</script>

<style lang="scss">
.action-box {
  margin-bottom: 15px;
}

.pagination-box {
  margin-top: 15px;
  margin-right: 15px;
  float: right;
}

.date-range-box {
  width: 100% !important;
}
</style>
