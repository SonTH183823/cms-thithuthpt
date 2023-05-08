<template>
  <div v-loading="loadingModel" class="news-form-container">
    <el-row><h2 style="font-weight: bold">Chi tiết model xe</h2></el-row>
    <el-row>
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-form-item sortable class="banner-attri" label="Kích hoạt">
          <el-switch
            v-model="form.active"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            style="margin-right: 10px;"
          />
        </el-form-item>
        <el-row :gutter="20" style="width: 100%">
          <el-col :xl="12" :md="12">
            <el-form-item class="banner-attri" label="Tên model xe" prop="name">
              <el-input placeholder="Honda City 2020" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item
              label="Dòng xe"
              label-width="150px"
              prop="brand"
            >
              <el-select v-model="form.brand" :disabled="!form.manufacturer" filterable placeholder="Chọn dòng xe">
                <el-option
                  v-for="item in listBrand"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                >
                </el-option>
                <div style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(2)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
                <div slot="empty" v-if="listBrand.length === 0" style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(2)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :md="12">
            <el-form-item
              label="Hãng sản xuất"
              label-width="150px"
              prop="manufacturer"
            >
              <el-select v-model="form.manufacturer" filterable placeholder="Chọn hãng xe" @change="onChangeManufacturer">
                <el-option
                  v-for="item in listManufacturer"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                >
                </el-option>
                <div style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(1)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
                <div slot="empty" v-if="listManufacturer.length === 0" style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(1)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item
              label="Năm sản xuất"
              label-width="150px"
              prop="year"
            >
              <el-select v-model="form.year" placeholder="Chọn năm">
                <el-option
                  v-for="item in totalYearFrom2010 + 1"
                  :key="item"
                  :label="item + 2009"
                  :value="item + 2009"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <h2 style="color: #0A9F46; font-weight: bold">Thông số kỹ thuật: </h2>
        <el-row :gutter="20" style="width: 100%">
          <el-col :xl="8" :lg="8" :md="8" :sm="24">
            <el-form-item class="banner-attri" label="Động cơ" prop="engine">
              <el-input placeholder="1.5 i-VTEC" v-model="form.engine"></el-input>
            </el-form-item>
            <el-form-item
              label="Kiểu dáng"
              label-width="150px"
              prop="figure"
            >
              <el-select v-model="form.figure" filterable placeholder="Chọn kiểu dáng">
                <el-option
                  v-for="item in listFigure"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                >
                </el-option>
                <div style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(4)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
                <div slot="empty" v-if="listFigure.length === 0" style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(4)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item
              label="Số chỗ"
              label-width="150px"
              prop="numberSeat"
            >
              <el-select v-model="form.numberSeat" placeholder="Chọn số chỗ">
                <el-option
                  v-for="item in numSeat"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="Nhiên liệu"
              label-width="150px"
              prop="fuel"
            >
              <el-select v-model="form.fuel" filterable placeholder="Chọn nhiên liệu">
                <el-option
                  v-for="item in listFuel"
                  :key="item._id"
                  :label="item.type"
                  :value="item._id"
                >
                </el-option>
                <div style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(5)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
                <div slot="empty" v-if="listFuel.length === 0" style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(5)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="8" :sm="24">
            <el-form-item
              label="Dẫn động"
              label-width="150px"
              prop="drive"
            >
              <el-select v-model="form.drive" placeholder="Chọn loại dẫn động">
                <el-option
                  v-for="item in listDrive"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                >
                </el-option>
                <div style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(6)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
                <div slot="empty" v-if="listDrive.length === 0" style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(6)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item
              label="Hộp số"
              label-width="150px"
              prop="gear"
            >
              <el-select v-model="form.gear" filterable placeholder="Chọn kiểu hộp số">
                <el-option
                  v-for="item in listGear"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                >
                </el-option>
                <div style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(8)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
                <div v-if="listGear.length === 0 " slot="empty" style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(8)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item
              label="Xuất xứ"
              label-width="150px"
              prop="origin"
            >
              <el-select v-model="form.origin" placeholder="Chọn xuất xứ">
                <el-option
                  v-for="item in listOrigin"
                  :key="item._id"
                  :label="item.source"
                  :value="item._id"
                >
                </el-option>
                <div style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(7)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
                <div slot="empty" v-if="listOrigin.length === 0" style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px">
                  <el-button size="small" @click="handleAdd(7)" style="width: 100%">
                    Thêm lựa chọn mới
                  </el-button>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item class="banner-attri" label="Phiên bản" prop="version">
              <el-input placeholder="CVT" v-model="form.version"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="8" :sm="24">
            <el-form-item class="banner-attri" label="Dung tích xi lanh (cc)" prop="cc">
              <el-input placeholder="1499cc" v-model="form.cc"></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Mã lực" prop="horsePower">
              <el-input placeholder="118/6600" v-model="form.horsePower"></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Mô-men xoắn" prop="torque">
              <el-input placeholder="145/4600" v-model="form.torque"></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Kích thước (mm)" prop="size">
              <el-input placeholder="4400x1694x1477" v-model="form.size"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="banner-attri" style="margin-right: 20px" label="Ghi chú" prop="note">
          <el-input type="textarea" :rows="2" v-model="form.note"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <ModalQuickAdd
      v-if="typeProperties !== '' "
      :type-properties="typeProperties"
      :dialog-form-visible="dialogFormVisible"
      :manufacturer-id="form.manufacturer"
      @update-visiable="updateVisiable"
      @createData="onCreateData"
    />
  </div>
</template>

<script>
import {validText} from "@/utils/validate"
import ModelCarAPI from "@/api/modelCarApi";
import ManufacturerAPI from "@/api/properties/manufacturerApi";
import BrandAPI from "@/api/properties/brandApi";
import FigureAPI from "@/api/properties/figureApi";
import DriveAPI from "@/api/properties/driveApi";
import FuelAPI from "@/api/properties/fuelApi";
import GearAPI from "@/api/properties/gearApi";
import OriginAPI from "@/api/properties/originApi";
import ModalQuickAdd from "@/views/manageModel/modalForm/ModalQuickAdd";
import config from "@/utils/config";

export default {
  components: { ModalQuickAdd },
  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đầy đủ trường!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      typeProperties: '',
      form: {
        name: '',
        manufacturer: '',
        brand: '',
        active: 1,
        year: '',
        engine: '',
        numberSeat: '',
        figure: '',
        fuel: '',
        drive: '',
        gear: '',
        origin: '',
        version: '',
        cc: '',
        horsePower: '',
        torque: '',
        size: '',
        note: ''
      },
      formRules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập tên model xe!',
            validator: validateText
          }
        ],
        brand: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn dòng xe!',
          validator: validateText
        }],
        manufacturer: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn hãng sản xuất!',
          validator: validateText
        }],
        year: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn năm sản xuất!'
        }],
        engine: [
          {
            required: true,
            trigger: 'blur',
            message: 'Hãy nhập tên động cơ!'
          },
          {
            required: true,
            pattern: /^[a-zA-Z\d\s\-\.]+$/,
            message: 'Chỉ được chứa chữ, dấu - và dấu chấm!',
            trigger: 'blur',
          }
        ],
        figure: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn kiểu dáng!',
          validator: validateText
        }],
        numberSeat: [{
          required: true,
          trigger: 'blur',
          validator: validateText,
          message: 'Hãy chọn số chỗ!'
        }],
        fuel: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn loại nhiên liệu!',
          validator: validateText
        }],
        drive: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn kiểu dẫn động!',
          validator: validateText
        }],
        gear: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn kiểu hộp số!',
          validator: validateText
        }],
        origin: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn nơi xuất xứ!',
          validator: validateText
        }],
        version: [
          {
            required: true,
            trigger: 'blur',
            validator: validateText
          },
          {
            required: true,
            pattern: /^[a-zA-Z\d\s\.]+$/,
            message: 'Chỉ được chứa chữ, số và dấu chấm!',
            trigger: 'blur',
          }
        ],
        cc: [{
          required: true,
          trigger: 'blur',
          validator: validateText
        }],
        horsePower: [
          {
            required: true,
            trigger: 'blur',
            validator: validateText
          },
          {
            required: true,
            pattern: /^[\d\/]+$/,
            message: 'Chỉ được chứa số và ký tự /',
            trigger: 'blur',
          }
        ],
        torque: [
          {
            required: true,
            trigger: 'blur',
            validator: validateText
          },
          {
            required: true,
            pattern: /^[0-9\/]+$/,
            message: 'Chỉ được chứa số và ký tự /',
            trigger: 'blur',
          }
        ],
        size: [
          {
            required: true,
            trigger: 'blur',
            validator: validateText
          },
          {
            required: true,
            pattern: /^[a-zA-Z\d]+$/,
            message: 'Chỉ được chứa chữ và số!',
            trigger: 'blur',
          }
        ]
      },
      formType: '',
      ModelID: this.$route.params.id,
      loadingModel: false,
      listManufacturer: [],
      listBrand: [],
      listFigure: [],
      listFuel: [],
      listDrive: [],
      listGear: [],
      listOrigin: [],
      numSeat: [2, 4, 5, 7, 9],
      totalYearFrom2010: new Date().getFullYear() + 1 - 2010
    }
  },
  watch: {
    'form.manufacturer': {
      handler: function (val) {
        this.getBrand(val)
      },
      deep: true,
    }
  },
  async mounted() {
    await Promise.all([
      this.getManufacturer(),
      this.getPropertiesCar()
    ])
    if (this.ModelID !== '0') {
      this.formType = 'edit'
      await this.loadFormEdit()
    } else {
      this.formType = 'create'
    }
  },
  methods: {
    onCreateData(res) {
      const {type, data} = res
      switch (type) {
        case config.specType.manufacturer: {
          this.form.manufacturer = data._id
          break
        }
        case config.specType.brand: {
          this.form.brand = data._id
          break
        }
        case config.specType.figure: {
          this.form.figure = data._id
          break
        }
        case config.specType.fuel: {
          this.form.fuel = data._id
          break
        }
        case config.specType.drive: {
          this.form.drive = data._id
          break
        }
        case config.specType.origin: {
          this.form.origin = data._id
          break
        }
        case config.specType.gear: {
          this.form.gear = data._id
          break
        }
      }
    },
    async getManufacturer() {
      const res = await ManufacturerAPI.get({ perPage: 1000 })
      this.listManufacturer = res.data
    },
    async getBrand(val) {
      if (this.form.manufacturer && val) {
        this.listBrand = await BrandAPI.getBrandByManufacturer(val, {active: 1})
      }
    },
    async getPropertiesCar() {
      // const figure = await FigureAPI.get({ perPage: 1000, active: 1 })
      // this.listFigure = figure.data
      // const drive = await DriveAPI.get({ perPage: 1000, active: 1 })
      // this.listDrive = drive.data
      // const fuel = await FuelAPI.get({ perPage: 1000, active: 1 })
      // this.listFuel = fuel.data
      // const gear = await GearAPI.get({ perPage: 1000, active: 1 })
      // this.listGear = gear.data
      // const origin = await OriginAPI.get({ perPage: 1000, active: 1 })

      const figure = await FigureAPI.get({ perPage: 1000 })
      this.listFigure = figure.data
      const drive = await DriveAPI.get({ perPage: 1000 })
      this.listDrive = drive.data
      const fuel = await FuelAPI.get({ perPage: 1000 })
      this.listFuel = fuel.data
      const gear = await GearAPI.get({ perPage: 1000 })
      this.listGear = gear.data
      const origin = await OriginAPI.get({ perPage: 1000 })
      this.listOrigin = origin.data
    },
    async loadFormEdit() {
      try {
        this.loadingModel = true
        const data = await ModelCarAPI.getById(this.ModelID)
        this.form = {
          ...data,
          brand: data.brand ? data.brand._id : '',
          drive: data.drive ? data.drive._id : '',
          figure: data.figure ? data.figure._id : '',
          fuel: data.fuel ? data.fuel._id : '',
          gear: data.gear ? data.gear._id : '',
          manufacturer: data.manufacturer ? data.manufacturer._id : '',
          origin: data.origin ? data.origin._id : '',
        }
        this.loadingModel = false
      } catch (err) {
        console.log(err)
      }
    },
    onChangeManufacturer() {
      this.form.brand = undefined
    },
    handleAdd(type) {
      this.typeProperties = type
      this.dialogFormVisible = true
    },
    async updateVisiable(e) {
      this.dialogFormVisible = e.data.visible
      switch (e.data.typeProp) {
        case 1: {
          await this.getManufacturer()
          break
        }
        case 2: {
          await this.getBrand(this.form.manufacturer)
          break
        }
        default:
          await this.getPropertiesCar()
          break
      }
    },
    handleCancel() {
      this.$router.push('/quan-ly-model-xe/model-xe')
    },
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          this.form.year = this.form.year.toString()
          switch (this.formType) {
            case 'create':
              await ModelCarAPI.create({
                ...this.form,
              })
              this.resetFormData()
              this.$router.push('/quan-ly-model-xe/model-xe')
              break
            case 'edit':
              // eslint-disable-next-line no-case-declarations
              const dataSubmit = {
                ...this.form,
                manufacturer: this.form.manufacturer._id || this.form.manufacturer,
                brand: this.form.brand._id || this.form.brand,
                drive: this.form.drive._id || this.form.drive,
                figure: this.form.figure._id || this.form.figure,
                fuel: this.form.fuel._id || this.form.fuel,
                gear: this.form.gear._id || this.form.gear,
                origin: this.form.origin._id || this.form.origin,
              }
              delete dataSubmit._id
              await ModelCarAPI.update(this.form._id, dataSubmit)
              this.resetFormData()
              this.$router.push('/quan-ly-model-xe/model-xe')
              break
          }
          this.resetFormData()
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    resetFormData() {
      this.form = {
        name: '',
        manufacturer: '',
        brand: '',
        active: 1,
        year: '',
        engine: '',
        numberSeat: '',
        figure: '',
        fuel: '',
        drive: '',
        gear: '',
        origin: '',
        version: '',
        cc: '',
        horsePower: '',
        torque: '',
        size: '',
        note: ''
      }
    },
  }
}
</script>

<style lang="scss">
.news-form-container {
  padding-left: 20px;
}

</style>
