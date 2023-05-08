<template>
  <el-table-column
    sortable
    :label="label"
    :prop="prop"
    :min-width="minWidth"
    :fixed="fixed ? fixed : null"
  >
    <template slot="header" slot-scope="scope">
      <span style="display: inline-block; margin-bottom: 5px">{{ label }}</span>

      <span v-if="type === 'config'" @click="$event.stopPropagation()">
        <el-select v-model="searchStr" size="mini" filterable clearable @change="onChange">
          <el-option
            v-for="(item) in configMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>

      <span v-else-if="type === 'date'" @click="$event.stopPropagation()">
        <el-date-picker
          v-model="searchStr"
          format="dd/MM/yyyy"
          placeholder="Ngày/Tháng/Năm"
          class="date-range-box"
          size="small"
          type="daterange"
          align="right"
          start-placeholder="Từ"
          end-placeholder="Đến"
          :default-time="['00:00:00', '23:59:59']"
          @change="onChange"
        />
      </span>

      <span v-else-if="type === 'number'" @click="$event.stopPropagation()">
        <el-select v-model="searchStr" size="mini" filterable clearable @change="onChange">
          <el-option
            v-for="(item) in Object.entries(configObj.numberMap)"
            :key="item[0]"
            :label="item[1]"
            :value="+item[0]"
          />
        </el-select>
      </span>

      <span v-else-if="type === 'number'" @click="$event.stopPropagation()">
        <el-input
          type="number"
          v-model="searchStr"
          size="mini"
          placeholder="Tìm kiếm..."
          suffix-icon="el-icon-search"
          @input="onChange"
        />
      </span>

      <span v-else @click="$event.stopPropagation()">
        <el-input
          v-model="searchStr"
          size="mini"
          placeholder="Tìm kiếm..."
          suffix-icon="el-icon-search"
          @input="onChange"
        />
      </span>

    </template>
    <template slot-scope="scope">
      <span v-if="isChildren && parentProp">
        <span v-if="type && type === 'object'">
          {{
            scope.row[parentProp][prop] ? (scope.row[parentProp][prop].name ? scope.row[parentProp][prop].name : scope.row[parentProp][prop].name) : ''
          }}
        </span>
        <span v-else-if="type && type === 'date'">{{ formatTime(scope.row[parentProp][prop], '{d}/{m}/{y}') }}</span>
        <span v-else-if="type && type === 'datetime'"
        >{{ formatTime(scope.row[parentProp][prop], '{d}/{m}/{y} {h}:{i}:{s}') }}</span>
        <span v-else-if="type && type === 'config'">{{ configMap[scope.row[parentProp][prop]] }}</span>
        <span v-else-if="type && type === 'number'">{{ scope.row[parentProp][prop] === 1 ? 'Có' : 'Không' }}</span>
        <span v-else-if="type && type === 'slot'">
          <slot name="custom" :scope="scope"/>
        </span>
        <!--        <span v-else-if="type && type === 'link'">-->
        <!--          <a class="row-link" :href="`${scope.row[prop]}`">{{ scope.row[prop] }}</a>-->
        <!--&lt;!&ndash;          <span class="row-link" @click="onClickRowLink(scope.row._id)">{{ scope.row[parentProp][prop] }}</span>&ndash;&gt;-->
        <!--        </span>-->
        <span v-else>{{ scope.row[parentProp][prop] }}</span>
      </span>

      <span v-else>
        <span v-if="type && type === 'object'">
          {{ scope.row[prop] ? (scope.row[prop].ten ? scope.row[prop].ten : scope.row[prop].name) : '' }}
        </span>
        <span v-else-if="type && type === 'date'">
          {{ scope.row[prop] ? formatTime(scope.row[prop], '{d}/{m}/{y}') : '' }}
        </span>
        <span v-else-if="type && type === 'datetime'">
          {{ formatTime(scope.row[prop], '{d}/{m}/{y} {h}:{i}:{s}') }}
        </span>
        <span v-else-if="type && type === 'img'">
          <img :src="imgSrc" alt="" style="aspect-ratio: 4/3; max-height: 100px">
        </span>
        <span v-else-if="type && type === 'config'">
          <div
            v-for="(item) in configMap"
            :key="item.value"
          >
            <el-tag v-if="item.value === scope.row[prop]" :type="item.typeTag">
              {{ item.label }}
            </el-tag>
          </div>
          <!--          {{ configObj[prop][scope.row[prop]] }}-->
        </span>
        <span v-else-if="type && type === 'user'">
          <div v-if="scope.row.type === 1">
            <i class="el-icon-user-solid"/>
            <span class="customer-link" @click="gotoUserDetail(scope.row.user)">{{ scope.row.user.name }}</span>
          </div>
          <div v-else/>
        </span>
        <span v-else-if="type && type === 'customer'">{{ scope.row[prop]['full_name'] }}</span>
        <span v-else-if="type && type === 'phone'">{{ scope.row[prop]['phone'] }}</span>
        <span v-else-if="type && type === 'quantity'">
          {{ totalUnit(scope.row.products) }}
          <!--          {{ scope.row[prop]['quantity'] }}-->
        </span>
        <span v-else-if="type && type === 'total'">{{ formatPrice(sum(scope.row.products)) + ' đ' }}</span>
        <span v-else-if="type && type === 'number'">{{ scope.row[prop] === 1 ? 'Có' : 'Không' }}</span>
        <span v-else-if="type && type === 'price'">{{ formatPrice(scope.row[prop]) + ' đ' }}</span>
        <span v-else-if="type && type === 'link'"><a class="row-link" :href="`${scope.row[prop]}`" target="_blank"
        >{{ scope.row[prop] }}</a></span>
        <span v-else-if="type && type === 'slot'">
          <slot name="custom" :scope="scope"/>
        </span>
        <!--        <span v-else-if="type && type === 'link'">-->
        <!--          <span class="row-link" @click="onClickRowLink(scope.row._id)">{{ scope.row[prop] }}</span>-->
        <!--        </span>-->
        <span v-else-if="type && type === 'array'">
          <el-tag
            v-for="item in scope.row[prop]"
            :key="item"
          >
            {{ item }}
          </el-tag>
        </span>
        <span v-else>{{ scope.row[prop] }}</span>
      </span>
    </template>
  </el-table-column>
</template>

<script>
import { parseTime } from '@/utils'
import config from '@/utils/config'
import moment from "moment"

export default {
  name: 'SearchColumn',
  props: {
    type: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    },
    parentProp: {
      type: String,
      default: ''
    },
    fixed: {
      type: String,
      default: ''
    },
    minWidth: {
      type: String,
      default: ''
    },
    isChildren: {
      type: Boolean,
      default: false
    },
    imgSrc: {
      type: String,
      default: ''
    },
    isSearchLocal: {
      type: Boolean,
      default: false
    },
    propConfig: {
      type: String,
      default: ''
    },
    searchRemote: {
      type: Function,
      default: () => {
      }
    },
    searchLocal: {
      type: Function,
      default: () => {
      }
    },
    onClickRowLink: {
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      configObj: { ...config },
      searchStr: ''
    }
  },
  computed: {
    configMap() {
      return this.propConfig ? this.configObj[this.propConfig] : this.configObj[this.prop]
    }
  },
  methods: {
    gotoUserDetail(data) {
      this.$router.push('/quan-ly/don-hang?id=' + data._id)
      this.typeTable = 'user'
    },
    onChange() {
      if (this.type && this.type === 'object') {
        this.isSearchLocal === true ? this.searchLocal(this.prop, this.searchStr) : this.searchRemote(this.prop, this.searchStr)
        // if (this.parentProp) {
        //   this.isSearchLocal === true ? this.searchLocal(this.parentProp + '.' + this.prop + '.name', this.searchStr) : this.searchRemote(this.parentProp + '.' + this.prop + '.name', this.searchStr)
        // } else {
        //   this.isSearchLocal === true ? this.searchLocal(this.prop + '.name', this.searchStr) : this.searchRemote(this.prop + '.name', this.searchStr)
        // }
      } else if (this.type && this.type === 'date') {
        const searchStr = (this.searchStr || []).map(item => {
          return moment(item).unix()
        })
        // const prop = ['startTime', 'endTime']
        this.isSearchLocal === true ? this.searchLocal(this.prop, this.searchStr) : this.searchRemote('startTime', searchStr[0])
        this.isSearchLocal === true ? this.searchLocal(this.prop, this.searchStr) : this.searchRemote('endTime', searchStr[1])
      } else if (this.type && this.type === 'phone') {
        this.isSearchLocal === true ? this.searchLocal(this.prop, this.searchStr) : this.searchRemote('phone', this.searchStr)
      } else if (this.type && this.type === 'quantity') {
        this.isSearchLocal === true ? this.searchLocal(this.prop, this.searchStr) : this.searchRemote('total_quantity', this.searchStr)
      } else if (this.type && this.type === 'total') {
        this.isSearchLocal === true ? this.searchLocal(this.prop, this.searchStr) : this.searchRemote('total_money', this.searchStr)
      } else if (this.type && this.type === 'customer') {
        this.isSearchLocal === true ? this.searchLocal(this.prop, this.searchStr) : this.searchRemote('full_name', this.searchStr)
      } else {
        this.isSearchLocal === true ? this.searchLocal(this.prop, this.searchStr) : this.searchRemote(this.prop, this.searchStr)
      }
    },
    formatTime(timeStamp, format) {
      return parseTime(timeStamp, format)
    },
    formatPrice(value) {
      const val = (value / 1).toFixed(0).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    totalUnit(item) {
      const totalQuantity = item.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.quantity
      }, 0)
      return totalQuantity
    },
    sum(item) {
      const total = item.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.total_price
      }, 0)
      return total
    },
  }
}
</script>

<style lang="scss">
.caret-wrapper {
  position: absolute !important;
  top: -5px;
  right: 6px;
}

.row-link {
  color: #007DB8;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.customer-link {
  cursor: pointer;
  color: #4a9bbe;
  margin-left: 6px;

  &:hover {
    text-decoration: underline;
  }
}
</style>
