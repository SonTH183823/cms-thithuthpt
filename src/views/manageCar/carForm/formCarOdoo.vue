<template>
  <div v-loading="loadingForm" class="news-form-container">
    <el-row><h2 style="font-weight: bold; margin-top: 5px">
      {{ formType !== 'edit' ? 'Cập nhật xe từ Odoo' : 'Chỉnh sửa xe' }}</h2>
    </el-row>
    <el-row>
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-tabs type="border-card" value="first">
          <el-tab-pane name="first">
            <span slot="label"><div style="font-weight: bold">THÔNG TIN XE</div></span>
            <h3 style="color: #0A9F46; font-weight: bold">Thông tin cơ bản </h3>
            <el-row :gutter="20" style="width: 100%">
              <el-col :xl="6" :lg="6" :md="6" :sm="8">
                <el-form-item class="banner-attri" label="Kích hoạt" prop="active">
                  <el-switch
                    v-model="form.active"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    style="margin-right: 10px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="6" :md="6" :sm="8">
                <el-form-item class="banner-attri" label="Biển đẹp">
                  <el-switch
                    v-model="form.nicePlateNumber"
                    :disabled="dataOdoo.nicePlateNumber && dataOdoo.nicePlateNumber !== ''"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="6" :md="6" :sm="8">
                <el-form-item class="banner-attri" label="Chứng nhận Carpla">
                  <el-switch
                    v-model="form.certification"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    style="margin-right: 10px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="6" :md="6" :sm="24">
                <el-form-item class="banner-attri" label="Chi nhánh" prop="branch">
                  <el-input
                    v-model="form.branch"
                    placeholder="Chi nhánh"
                    :disabled="dataOdoo.branch && dataOdoo.branch !== ''"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="width: 100%">
              <el-col :xl="8" :lg="8" :md="8" :sm="24">
                <el-form-item
                  label="Trạng thái"
                  label-width="50px"
                  prop="status"
                >
                  <el-select
                    v-model="form.status"
                    :disabled="dataOdoo.state && dataOdoo.state !== ''"
                    placeholder="Trạng thái xe"
                  >
                    <el-option
                      v-for="item in config.statusMyCar"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item class="banner-attri" label="Tên xe" prop="name">
                  <el-input
                    v-model="form.name"
                    :disabled="dataOdoo.name !== ''"
                    placeholder="Honda City 2020"
                  />
                </el-form-item>
                <el-form-item
                  label="Hãng sản xuất"
                  label-width="150px"
                  prop="attributes.manufacturer"
                >
                  <el-select
                    v-model="form.attributes.manufacturer"
                    :disabled="dataOdoo.manufacturerId && dataOdoo.manufacturerId !== {}"
                    filterable
                    placeholder="Chọn hãng xe"
                    @change="onChangeManufacturer"
                  >
                    <el-option
                      v-for="item in listManufacturer"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                    />
                    <div
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(1)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                    <div
                      v-if="listManufacturer.length === 0"
                      slot="empty"
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(1)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="Dòng xe"
                  label-width="150px"
                  prop="attributes.brand"
                >
                  <el-select
                    v-model="form.attributes.brand"
                    :disabled="!form.attributes.manufacturer"
                    filterable
                    placeholder="Hãy chọn hãng xe trước"
                  >
                    <el-option
                      v-for="item in listBrand"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                    />
                    <div
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(2)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                    <div
                      v-if="listBrand.length === 0"
                      slot="empty"
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(2)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="Màu xe"
                  label-width="150px"
                  prop="color"
                >
                  <div style="display: flex; flex-direction: row">
                    <el-select
                      v-model="form.color"
                      :disabled="dataOdoo.colorId && dataOdoo.colorId !== {}"
                      filterable
                      placeholder="Chọn màu xe"
                      style="  margin-left: 5px;"
                    >
                      <el-option
                        v-for="item in colorList"
                        :key="item._id"
                        :label="item.color"
                        :value="item._id"
                      />
                      <div
                        style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                      >
                        <el-button size="small" style="width: 100%" @click="handleAdd(3)">
                          Thêm lựa chọn mới
                        </el-button>
                      </div>
                      <div
                        v-if="colorList.length === 0"
                        slot="empty"
                        style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                      >
                        <el-button size="small" style="width: 100%" @click="handleAdd(3)">
                          Thêm lựa chọn mới
                        </el-button>
                      </div>
                    </el-select>
                    <div class="color-div" :style="{ backgroundColor: colorCode ? colorCode : '#fff' }"/>
                    <!--                    <el-color-picker :key="'color' + keyColor" v-model="colorCode"/>-->
                  </div>
                </el-form-item>

              </el-col>
              <el-col :xl="8" :lg="8" :md="8" :sm="24">
                <el-form-item
                  label="Biển số"
                  label-width="150px"
                  prop="licensePlates"
                >
                  <el-input
                    v-model="form.licensePlates"
                    :disabled="dataOdoo.licensePlates && dataOdoo.licensePlates !== ''"
                    @blur="onBSXBlur"
                  />
                </el-form-item>
                <el-form-item
                  label="Loại biển"
                  label-width="150px"
                  prop="plateNumberType"
                >
                  <el-select
                    v-model="form.plateNumberType"
                    placeholder="Loại biển sẽ tự động điền khi BSX được nhập"
                    disabled
                  >
                    <el-option
                      v-for="item in plateNumTypeList"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="Màu biển"
                  label-width="150px"
                  prop="plateNumberColor"
                >
                  <el-select
                    v-model="form.plateNumberColor"
                    :disabled="dataOdoo.plateNumberColor && dataOdoo.plateNumberColor !== ''"
                    placeholder="Chọn màu biển"
                  >
                    <el-option
                      v-for="item in plateNumColorList"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="Tỉnh thành"
                  label-width="150px"
                  prop="province"
                >
                  <el-select
                    v-model="form.province"
                    :disabled="dataOdoo.province !== ''"
                    filterable
                    placeholder="Chọn tỉnh thành"
                  >
                    <el-option
                      v-for="item in listProvince"
                      :key="item.code"
                      :label="item.name_with_type"
                      :value="item.name_with_type"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item class="banner-attri" label="Số chủ" prop="ownerNumber">
                  <el-input-number
                    v-model="form.ownerNumber"
                    :min="1"
                    :max="10"
                    placeholder="Số chủ"
                    style="width: 100%"
                    :disabled="dataOdoo.ownerNumber && dataOdoo.ownerNumber !== ''"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="8" :md="8" :sm="24">
                <el-form-item
                  label="Năm sản xuất"
                  label-width="150px"
                  prop="attributes.year"
                >
                  <el-select
                    v-model="form.attributes.year"
                    :disabled="dataOdoo.year && dataOdoo.year.length > 0"
                    placeholder="Chọn năm"
                  >
                    <el-option
                      v-for="item in totalYearFrom2010 + 1"
                      :key="item"
                      :label="item + 2009"
                      :value="item + 2009"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="Giá dự kiến"
                  label-width="150px"
                  prop="price"
                >
                  <el-input-number
                    v-model="form.price"

                    style="width: 100%"
                    :min="0"
                    :step="500000"
                    :disabled="dataOdoo.price > 0"
                  />
                </el-form-item>
                <el-form-item
                  label="Giá thực tế"
                  label-width="150px"
                  prop="listedPrice"
                >
                  <el-input-number
                    v-model="form.listedPrice"
                    :controls="true"
                    style="width: 100%"
                    :min="0"
                    :step="500000"
                    :disabled="dataOdoo.listedPrice > 0"
                  />
                </el-form-item>
                <el-form-item class="banner-attri" label="Số khung" prop="vinNumber">
                  <el-input
                    v-model="form.vinNumber"
                    placeholder="Số khung"
                    :disabled="dataOdoo.vinNumber && dataOdoo.vinNumber !== ''"
                  />
                </el-form-item>
                <el-form-item
                  label="Odo (km)"
                  label-width="150px"
                  prop="price"
                >
                  <el-input-number
                    v-model="form.odo"
                    placeholder="2000"
                    :disabled=" dataOdoo.odo !== 0"
                    :controls="true"
                    style="width: 100%"
                    :min="0"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <h3 style="color: #0A9F46; font-weight: bold">Thông số kỹ thuật </h3>
            <el-form-item
              label="Model xe"
              label-width="150px"
              style="margin-right: 20px"
            >
              <el-select
                v-model="modelCar"
                clearable
                filterable
                placeholder="Chọn nhanh model xe"
                :disabled="formType==='edit'"
              >
                <el-option
                  v-for="(item, index) in listModelCar"
                  :key="item._id"
                  :label="item.name"
                  :value="index"
                />
              </el-select>
            </el-form-item>
            <el-row :gutter="20" style="width: 100%">
              <el-col :xl="8" :lg="8" :md="8" :sm="24">
                <el-form-item class="banner-attri" label="Động cơ" prop="attributes.engine">
                  <el-input
                    v-model="form.attributes.engine"
                    placeholder="1.5 i-VTEC"
                    :disabled="dataOdoo.engine && dataOdoo.engine !== ''"
                  />
                </el-form-item>
                <el-form-item
                  label="Kiểu dáng"
                  label-width="150px"
                  prop="attributes.figure"
                >
                  <el-select
                    v-model="form.attributes.figure"
                    :disabled="dataOdoo.figureId && dataOdoo.figureId !== {}"
                    filterable
                    placeholder="Chọn kiểu dáng"
                  >
                    <el-option
                      v-for="item in listFigure"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                    />
                    <div
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(4)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                    <div
                      v-if="listFigure.length === 0"
                      slot="empty"
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(4)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="Số chỗ"
                  label-width="150px"
                  prop="attributes.numberSeat"
                >
                  <el-select
                    v-model="form.attributes.numberSeat"
                    :disabled="dataOdoo.numberSeat && dataOdoo.numberSeat !== ''"
                    placeholder="Chọn số chỗ"
                  >
                    <el-option
                      v-for="item in numSeat"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="Nhiên liệu"
                  label-width="150px"
                  prop="attributes.fuel"
                >
                  <el-select
                    v-model="form.attributes.fuel"
                    :disabled="dataOdoo.fuelId && dataOdoo.fuelId !== {}"
                    placeholder="Chọn nhiên liệu"
                  >
                    <el-option
                      v-for="item in listFuel"
                      :key="item._id"
                      :label="item.type"
                      :value="item._id"
                    />
                    <div
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(5)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                    <div
                      v-if="listFuel.length === 0"
                      slot="empty"
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(5)">
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
                  prop="attributes.drive"
                >
                  <el-select
                    v-model="form.attributes.drive"
                    :disabled="dataOdoo.driveId && dataOdoo.driveId !== {}"
                    placeholder="Chọn loại dẫn động"
                  >
                    <el-option
                      v-for="item in listDrive"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                    />
                    <div
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(6)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                    <div
                      v-if="listDrive.length === 0"
                      slot="empty"
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(6)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="Hộp số"
                  label-width="150px"
                  prop="attributes.gear"
                >
                  <el-select
                    v-model="form.attributes.gear"
                    :disabled="dataOdoo.gearId && dataOdoo.gearId !== {}"
                    placeholder="Chọn kiểu hộp số"
                  >
                    <el-option
                      v-for="item in listGear"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                    />
                    <div
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(8)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                    <div
                      v-if="listGear.length === 0"
                      slot="empty"
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(8)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="Xuất xứ"
                  label-width="150px"
                  prop="attributes.origin"
                >
                  <el-select
                    v-model="form.attributes.origin"
                    :disabled="dataOdoo.originId && dataOdoo.originId !== {}"
                    placeholder="Chọn xuất xứ"
                  >
                    <el-option
                      v-for="item in listOrigin"
                      :key="item._id"
                      :label="item.source"
                      :value="item._id"
                    />
                    <div
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(7)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                    <div
                      slot="empty"
                      style="width: 100%; margin-top: 10px; margin-bottom: 10px; padding-left: 10px; padding-right: 10px"
                    >
                      <el-button size="small" style="width: 100%" @click="handleAdd(7)">
                        Thêm lựa chọn mới
                      </el-button>
                    </div>
                  </el-select>
                </el-form-item>
                <el-form-item class="banner-attri" label="Phiên bản" prop="attributes.version">
                  <el-input
                    v-model="form.attributes.version"
                    placeholder="CVT"
                    :disabled="dataOdoo.version && dataOdoo.version !== ''"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="8" :md="8" :sm="24">
                <el-form-item class="banner-attri" label="Dung tích xi lanh (cc)" prop="attributes.cc">
                  <el-input
                    v-model="form.attributes.cc"
                    placeholder="1499"
                    :disabled="dataOdoo.cc && dataOdoo.cc !== ''"
                  />
                </el-form-item>
                <el-form-item class="banner-attri" label="Mã lực" prop="attributes.horsePower">
                  <el-input
                    v-model="form.attributes.horsePower"
                    placeholder="118/6600"
                    :disabled="dataOdoo.horsePower && dataOdoo.horsePower !== ''"
                  />
                </el-form-item>
                <el-form-item class="banner-attri" label="Mô-men xoắn" prop="attributes.torque">
                  <el-input
                    v-model="form.attributes.torque"
                    placeholder="145/4600"
                    :disabled="dataOdoo.torque && dataOdoo.torque !== ''"
                  />
                </el-form-item>
                <el-form-item class="banner-attri" label="Kích thước (mm)" prop="attributes.size">
                  <el-input
                    v-model="form.attributes.size"
                    placeholder="4400x1694x1477"
                    :disabled="dataOdoo.size && dataOdoo.size !== ''"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <h3 style="color: #0A9F46; font-weight: bold">Mô tả xe </h3>
            <el-row :gutter="20" style="width: 100%">
              <el-col :xl="8" :lg="8" :md="8" :sm="24">
                <el-form-item class="banner-attri" label="Mô tả chung" prop="general">
                  <el-input v-model="form.general" type="textarea" :rows="5"/>
                </el-form-item>
                <el-form-item
                  label="Mạng lưới bảo hành"
                  label-width="150px"
                  prop="warrantyNetwork"
                >
                  <el-input v-model="form.warrantyNetwork" type="textarea" :rows="5"/>
                </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="8" :md="8" :sm="24">
                <el-form-item
                  label="Thông tin nổi bật"
                  label-width="150px"
                  prop="highlights"
                >
                  <el-input v-model="form.highlights" type="textarea" :rows="5"/>
                </el-form-item>
                <el-form-item
                  label="Chính sách bảo hành"
                  label-width="150px"
                  prop="warrantyPolicy"
                >
                  <el-input v-model="form.warrantyPolicy" type="textarea" :rows="5"/>
                </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="8" :md="8" :sm="24">
                <el-form-item class="banner-attri" label="Thông tin khuyến mãi" prop="promotionInformation">
                  <el-input v-model="form.promotion" type="textarea" :rows="5"/>
                </el-form-item>
                <el-form-item label="Chính sách bán hàng" prop="salePolicy">
                  <el-input
                    v-model="form.salePolicy"
                    type="textarea"
                    :rows="5"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item class="banner-attri" style="margin-right: 20px" label="Ghi chú" prop="note">
              <el-input
                v-model="form.note"
                type="textarea"
                :rows="2"
                :disabled="dataOdoo.note && dataOdoo.note !== ''"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label" style="font-weight: bold">MEDIA XE</span>
            <el-row>
              <UploadMedia @update-media="handleUpdateMedia" @loading-up-media="handleLoadingUpMedia"/>
            </el-row>
            <div v-loading="loadingUpMedia" element-loading-text="Đang tải">
              <el-row>
                <el-col :xl="12" :lg="12">
                  <el-form-item label="Ảnh cover" prop="imgCover">
                    <div v-if="form.imgCover">
                      <img
                        :src="`${config.api.domainUpload}/${form.imgCover}`"
                        alt=""
                        width="40%"
                        class="img-item one-img"
                      >
                      <span class="icon-remove-img icon-remove-img-cover" @click="removeImgCover">
                        <el-icon name="error"/>
                      </span>
                    </div>
                    <img v-else src="../../../assets/images/car_placeholder.jpg" width="40%" alt=""/>
                    <div class="el-row--flex" v-if="!form.imgCover">
                      <el-button type="text" @click="addImg('cover')">Thêm ảnh cover</el-button>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :xl="12" :lg="12">
                  <el-form-item label="Tiếng động cơ">
                    <audio v-if="form.engineSound && !audioErorr" controls>
                      <source
                        :src="`https://dev-storage.carpla.dev/dev-carpla-tc/${form.engineSound}`"
                        type="audio/mpeg"
                      >
                      Your browser does not support the audio element.
                    </audio>
                    <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 20px">
                      <a-upload
                        v-model="form.engineSound"
                        :custom-request="handleUploadFile"
                        :before-upload="beforeUploadAudio"
                      >
                        <a-button>
                          <i
                            v-if="loadingUploadAudio"
                            class="el-icon-loading"
                            style="margin-right: 5px"
                          />
                          <el-icon v-else name="upload2" style="margin-right: 5px"/>
                          Tải lên file audio
                        </a-button>
                      </a-upload>
                      <div v-if="audioErorr" style="color:red; margin-left: 20px">{{ audioErorr }}</div>
                    </div>
                    <div
                      v-if="form.engineSound && audioErorr === ''"
                      style=" display: flex;flex-direction: row; margin-bottom: 20px"
                    >{{ form.engineSound }}
                      <div style="margin-left: 20px" @click="removeMp3File">
                        <el-icon name="delete" class="icon-remove"/>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :xl="12" :lg="12">
                  <el-form-item label="Ảnh chi tiết xe" prop="imgDetail">
                    <el-carousel
                      v-if="form.imgDetail && form.imgDetail.length"
                      :autoplay="false"
                      trigger="click"
                      indicator-position="none"
                      type="card"
                      height="250px"
                    >
                      <el-carousel-item v-for="(path, idx) in form.imgDetail" :key="'img-detail-' + idx">
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          alt=""
                          width="100%"
                          height="100%"
                          class="img-item one-img"
                        >
                      </el-carousel-item>
                    </el-carousel>
                    <img v-else src="../../../assets/images/car_placeholder.jpg" width="80%" height="300px"
                         class="one-img"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('details')">
                        Thêm ảnh chi tiết xe ({{ form.imgDetail.length || 0 }})
                      </el-button>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :xl="12" :lg="12">
                  <el-form-item label="Video" prop="video">
                    <div
                      v-loading="loadingUploadVideo"
                      element-loading-text="Loading..."
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.3)"
                      style="width: 80%; height: 300px; display: flex;"
                    >
                      <video v-if="form.video && !videoErorr && !loadingUploadVideo" width="auto" height="300" controls>
                        <source :src="`${config.api.domainUploadFile}/dev-carpla-tc/${form.video}`" type="video/mp4">
                        Your browser does not support the video tag.
                      </video>
                      <img
                        v-else-if="!loadingUploadVideo"
                        src="../../../assets/images/video-placeholder.jpg"
                        width="80%"
                        height="300px"
                        class="img-item one-img"
                      />
                    </div>
                    <div
                      v-if="form.video && videoErorr === ''"
                      style=" display: flex;flex-direction: row; margin-bottom: 20px"
                    >{{ form.video }}
                      <div style="margin-left: 20px" @click="removeVideo">
                        <el-icon name="delete" class="icon-remove"/>
                      </div>
                    </div>
                    <div
                      style="display: flex; flex-direction: row; align-items: center; margin-bottom: 20px; margin-top: 10px"
                    >
                      <a-upload
                        :custom-request="handleUploadVideo"
                        :before-upload="beforeUploadVideo"
                      >
                        <a-button>
                          <i
                            v-if="loadingUploadVideo"
                            class="el-icon-loading"
                            style="margin-right: 5px"
                          />
                          <el-icon v-else name="upload2" style="margin-right: 5px;"/>
                          Tải lên video
                        </a-button>
                      </a-upload>
                      <div v-if="videoErorr" style="color:#f56c6c; margin-left: 20px">{{ videoErorr }}</div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :xl="12" :lg="24">
                  <el-form-item label="Ảnh nội thất 360" prop="img360in">
                    <el-carousel
                      v-if="form.img360in && form.img360in.length"
                      :autoplay="false"
                      trigger="click"
                      indicator-position="none"
                      type="card"
                      height="250px"
                    >
                      <el-carousel-item v-for="(path, idx) in form.img360in" :key="'img-360in-' + idx">
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          alt=""
                          width="100%"
                          height="100%"
                          class="img-item one-img"
                        >
                      </el-carousel-item>
                    </el-carousel>
                    <img v-else src="../../../assets/images/car_placeholder.jpg" width="80%" height="300px"/>
                    <div class="el-row--flex is-justify-center">
                      <el-button type="text" @click="addImg('360in')">
                        Thêm ảnh nội thất 360 ({{ form.img360in.length || 0 }})
                      </el-button>
                    </div>
                    <a-upload
                      :custom-request="handleUploadFolder"
                      directory
                      style="margin-left: 12px"
                      @change="uploadFolder360in"
                    >
                      <a-button>
                        <el-icon name="upload2" style="margin-right: 5px"/>
                        Tải lên thư mục
                      </a-button>
                    </a-upload>
                  </el-form-item>
                </el-col>
                <el-col :xl="12" :lg="24">
                  <el-form-item label="Ảnh ngoại thất 360" prop="img360">
                    <el-carousel
                      v-if="form.img360 && form.img360.length"
                      :autoplay="false"
                      trigger="click"
                      indicator-position="none"
                      type="card"
                      height="250px"
                    >
                      <el-carousel-item v-for="(path, idx) in form.img360" :key="'img-360-' + idx">
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          alt=""
                          width="100%"
                          height="100%"
                          class="img-item one-img"
                        >
                      </el-carousel-item>
                    </el-carousel>
                    <img v-else src="../../../assets/images/car_placeholder.jpg" width="80%" height="300px"/>
                    <div class="el-row--flex is-justify-center">
                      <el-button type="text" @click="addImg('360')">
                        Thêm ảnh ngoại thất 360 ({{ form.img360.length || 0 }})
                      </el-button>
                    </div>
                    <a-upload
                      :custom-request="handleUploadFolder"
                      directory
                      style="margin-left: 12px"
                      @change="uploadFolder360"
                    >
                      <a-button>
                        <el-icon name="upload2" style="margin-right: 5px"/>
                        Tải lên thư mục
                      </a-button>
                    </a-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

          </el-tab-pane>
        </el-tabs>
        <el-form-item style="margin-top: 30px">
          <div v-if="formType!=='edit'">
            <el-checkbox v-model="saveModel"/>
            Lưu Model xe
          </div>
          <div v-if="formMessage.length > 0">
            <div v-for="mes in formMessage">
              <li style="color: #f56c6c">{{ mes }}</li>
            </div>
            <div style="color: #f56c6c">Hãy nhập đầy đủ thông tin và Media của xe!</div>
          </div>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <ModalQuickAdd
      v-if="typeProperties !== '' "
      :type-properties="typeProperties"
      :dialog-form-visible="dialogFormVisible"
      :manufacturer-id="form.attributes.manufacturer"
      @update-visiable="updateVisiable"
      @createData="onCreateData"
    />

    <el-dialog
      :title="formTypeImg ==='cover' ? 'Ảnh cover' : (formTypeImg === 'details' ? 'Ảnh chi tiết xe' : (formTypeImg === '360' ? 'Ảnh ngoại thất 360' : 'Ảnh nội thất 360'))"
      :visible.sync="dialogImgVisible"
      :close-on-click-modal="false"
      width="70%"
    >
      <div>
        <file-pond
          v-if="formTypeImg === 'cover'"
          ref="pond"
          allow-image-preview="true"
          class-name="file-pond1"
          label-idle="Tải lên ảnh"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="imageCover"
          :server="serverImgCover"
          credits="false"
          instant-upload="true"
          @removefile="removeImgCover"
        />
        <file-pond
          v-else-if="formTypeImg === 'details'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="imgDetails"
          :server="serverImgDetails"
          credits="false"
          instant-upload="true"
        />
        <div
          v-if="formTypeImg === 'details' && form.imgDetail && form.imgDetail.length"
          class="el-row--flex is-justify-end"
          style="margin-bottom: 15px"
        >
          <el-button type="danger" plain icon="el-icon-delete" @click="removeAllImgDetails">Xóa tất cả</el-button>
        </div>
        <div v-if="formTypeImg === 'details' && form.imgDetail.length > 0" class="img-360-grid">
          <div
            v-for="(path, idx) in form.imgDetail"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              class="one-img"
            >
            <span class="icon-remove-img" @click="removeImgDetailFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>
        <file-pond
          v-else-if="formTypeImg === '360'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="img360"
          :server="serverImg360"
          credits="false"
          instant-upload="true"
        />
        <div
          v-if="formTypeImg === '360' && form.img360 && form.img360.length"
          class="el-row--flex is-justify-end"
          style="margin-bottom: 15px"
        >
          <el-button type="danger" plain icon="el-icon-delete" @click="removeAllImg360">Xóa tất cả</el-button>
        </div>
        <div v-if="formTypeImg === '360' && form.img360.length > 0" class="img-360-grid">
          <div
            v-for="(path, idx) in form.img360"
            :key="'img-360' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              class="one-img"
            >
            <span class="icon-remove-img" @click="removeImg360FormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>
        <file-pond
          v-else-if="formTypeImg === '360in'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="img360in"
          :server="serverImg360in"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === '360in' && form.img360in.length > 0" class="img-360-grid">
          <div
            v-for="(path, idx) in form.img360in"
            :key="'img-360in' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              class="one-img"
            >
            <span class="icon-remove-img" @click="removeImg360inFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import { validText } from "@/utils/validate"
import ManufacturerAPI from "@/api/properties/manufacturerApi"
import BrandAPI from "@/api/properties/brandApi"
import FigureAPI from "@/api/properties/figureApi"
import DriveAPI from "@/api/properties/driveApi"
import FuelAPI from "@/api/properties/fuelApi"
import GearAPI from "@/api/properties/gearApi"
import OriginAPI from "@/api/properties/originApi"
import ModalQuickAdd from "@/views/manageModel/modalForm/ModalQuickAdd"
import config from '@/utils/config'
import CarAPI from '@/api/carApi'
import vueFilePond, { setOptions } from "vue-filepond"
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import ColorAPI from '@/api/properties/colorApi'
import ModelCarAPI from "@/api/modelCarApi"
import listProvince from "./provicens"
import request from '@/utils/request'
import MinIOAPI from '@/api/minioApi'
import UploadMedia from "@/views/manageCar/UploadMedia"

setOptions({
  styleLoadIndicatorPosition: "right top",
  styleProgressIndicatorPosition: "right top",
  styleButtonRemoveItemPosition: "left top",
  styleButtonProcessItemPosition: "right top",
  labelFileProcessing: 'Đang tải',
  labelTapToCancel: 'Bấm để hủy',
  labelTapToUndo: '',
  labelFileProcessingComplete: 'Thành công',
})

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageResize
)

export default {
  components: { ModalQuickAdd, FilePond, UploadMedia },
  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Trường này không được để trống'))
      } else {
        callback()
      }
    }
    const validateNumberImg = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Không được để trống'))
      } else {
        if (value.length === 0) {
          callback(new Error('Hãy chọn ảnh chi tiết'))
        } else if (value.length < 6) {
          callback(new Error('Tối thiểu phải có 6 ảnh chi tiết'))
        } else {
          callback()
        }
      }
    }
    return {
      config,
      dataOdoo: [],
      audioErorr: '',
      formMessage: [],
      listProvince,
      dialogFormVisible: false,
      dialogImgVisible: false,
      dialogAudioVisible: true,
      formTypeImg: 'cover',
      imgDetails: [],
      mp3File: [],
      imageCover: [],
      serverImgCover: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCover/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.imgCover = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverImgDetails: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carDetail/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.imgDetail.push(data.path)
            this.form.imgDetail.sort((a, b) => {
              if (a.slice(0, -19).length < b.slice(0, -19).length) {
                return -1
              } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
                return a.slice(0, -19).localeCompare(b.slice(0, -19))
              } else {
                return 1
              }
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverImg360: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          const data = await MinIOAPI.getPreUrlUpload({ name: `car360/${file.name}` })
          await MinIOAPI.upload(data.url, file)
          this.form.img360.push(data.path)
          this.form.img360.sort((a, b) => {
            if (a.slice(0, -19).length < b.slice(0, -19).length) {
              return -1
            } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            } else {
              return 1
            }
          })
          return load(file)
        },
        revert: null
      },
      serverImg360in: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          const data = await MinIOAPI.getPreUrlUpload({ name: `car360/${file.name}` })
          await MinIOAPI.upload(data.url, file)
          this.form.img360in.push(data.path)
          this.form.img360in.sort((a, b) => {
            if (a.slice(0, -19).length < b.slice(0, -19).length) {
              return -1
            } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            } else {
              return 1
            }
          })
          return load(file)
        },
        revert: null
      },
      typeProperties: '',
      plateNumTypeList: [
        { _id: 1, name: 'Biển Hà Nội' },
        { _id: 2, name: 'Biển Hồ Chí Minh' },
        { _id: 3, name: 'Biển tỉnh' },
      ],
      plateNumColorList: [
        { _id: 1, name: 'Biển trắng' },
        { _id: 2, name: 'Biển vàng' },
      ],
      videoErorr: '',
      colorList: [],
      colorCode: '#fff',
      keyColor: 1,
      linkVideo: '',
      form: {
        salePolicy: '',
        branch: '',
        certification: 1,
        listedPrice: 0,
        img360: [],
        img360in: [],
        video: '',
        engineSound: '',
        active: 1,
        status: 1,
        name: '',
        price: 0,
        province: '',
        color: '',
        ownerNumber: 1,
        odo: '',
        licensePlates: '',
        imgCover: '',
        imgDetail: [],
        note: '',
        nicePlateNumber: '',
        plateNumberType: '',
        plateNumberColor: 1,
        vinNumber: '',
        attributes: {
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
        },
        general: '',
        highlights: '',
        warrantyPolicy: '',
        warrantyNetwork: '',
        promotion: '',
        saveTemplate: 1
      },
      formRules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập tên xe!',
            validator: validateText
          }
        ],
        imgCover: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn ảnh cover',
        }],
        imgDetail: [{
          required: true,
          trigger: 'blur',
          validator: validateNumberImg
        }],
        img360: [{
          required: false,
          trigger: 'blur',
          message: 'Vui lòng chọn ảnh 360',
        }],
        general: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập mô tả chung',
        }],
        plateNumberType: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn loại biển',
        }],
        plateNumberColor: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn màu biển',
        }],
        vinNumber: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập số khung',
        }],
        'attributes.brand': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn dòng xe',
        }],
        'attributes.manufacturer': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn hãng sản xuất',
        }],
        'attributes.year': [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn năm sản xuất'
        }],
        color: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn màu xe'
        }],
        price: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập giá xe'
        }],
        listedPrice: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập giá xe'
        }],
        licensePlates: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập biển số xe'
          },
          {
            required: true,
            pattern: /^[1-9]\d([A-Z]|LD)(((?!0000)\d{4})|((?!00000)\d{5}))$/,
            message: 'Biển số xe không đúng định dạng!',
            trigger: 'blur',
          }],
        province: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập tỉnh thành'
        }],
        warrantyPolicy: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập chính sách bảo hành'
        }],
        'attributes.engine': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập động cơ'
        }],
        'attributes.origin': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn xuất xứ'
        }],
        'attributes.figure': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn kiểu dáng'
        }],
        'attributes.version': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập phiên bản'
        }],
        'attributes.numberSeat': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập số chỗ'
        }],
        'attributes.cc': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập dung tích xi lanh'
        }],
        'attributes.fuel': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn nhiên liệu'
        }],
        'attributes.horsePower': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập mã lực'
        }],
        'attributes.drive': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn hệ thống dẫn động'
        }],
        'attributes.torque': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập mô-men xoắn'
        }],
        'attributes.gear': [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn hộp số'
        }],
        'attributes.size': [{
          required: true,
          trigger: 'blur',
          message: 'Vui nhập kích thước'
        }],
        branch: [
          {
            required: true,
            trigger: 'blur',
            message: 'Vui lòng nhập chi nhánh'
          }
        ]
      },
      formType: '',
      mediaCarId: this.$route.params.id,
      loadingForm: false,
      listManufacturer: [],
      listBrand: [],
      listFigure: [],
      listFuel: [],
      listDrive: [],
      listGear: [],
      listOrigin: [],
      listModelCar: [],
      modelCar: undefined,
      numSeat: [2, 4, 5, 7, 9],
      totalYearFrom2010: new Date().getFullYear() + 1 - 2010,
      saveModel: true,
      img360: [],
      img360in: [],
      loadingUploadAudio: false,
      loadingUploadVideo: false,
      loadingUpMedia: false
    }
  },
  watch: {
    modelCar: {
      handler: async function(index) {
        const value = this.listModelCar[index]
        if (value) {
          this.form.attributes.cc = value.cc
          this.form.attributes.engine = value.engine
          this.form.attributes.drive = value.drive._id
          this.form.attributes.figure = value.figure._id
          this.form.attributes.gear = value.gear._id
          this.form.attributes.horsePower = value.horsePower
          this.form.attributes.numberSeat = value.numberSeat
          this.form.attributes.origin = value.origin._id
          this.form.attributes.torque = value.torque
          this.form.attributes.fuel = value.fuel._id
          this.form.attributes.version = value.version
          this.form.attributes.size = value.size
          this.saveModel = false
        } else {
          this.form.attributes.cc = ''
          this.form.attributes.engine = ''
          this.form.attributes.drive = ''
          this.form.attributes.figure = ''
          this.form.attributes.gear = ''
          this.form.attributes.horsePower = ''
          this.form.attributes.numberSeat = ''
          this.form.attributes.origin = ''
          this.form.attributes.torque = ''
          this.form.attributes.fuel = ''
          this.form.attributes.version = ''
          this.form.attributes.size = ''
          this.saveModel = true
        }
      },
      deep: true
    },
    'form.color': {
      handler: async function(colorId) {
        await this.getColor()
        const color = this.colorList.find(item => item._id === colorId) || { colorCode: '#fff' }
        this.colorCode = color.colorCode
        this.keyColor++
      },
      deep: true,
      immediate: true
    },
    saveModel: {
      handler: async function(val) {
        if (val) {
          this.form.saveTemplate = 1
        } else {
          this.form.saveTemplate = 0
        }
      },
      deep: true,
      immediate: true
    },
    licensePlates: {
      handler: function(val) {
        this.onBSXBlur()
      },
      deep: true,
      immediate: true
    },
    'form.attributes.manufacturer': {
      handler: function(val) {
        this.getBrand(val)
      },
      deep: true,
    }
  },
  async mounted() {
    this.loadingForm = true
    await Promise.all([
      this.getManufacturer(),
      this.getPropertiesCar(),
      this.getColor(),
      this.getModelCar()
    ])

    if (this.mediaCarId) {
      if (this.$router.history.current.query.type === 'edit') {
        this.formType = 'edit'
        this.saveModel = false
        await this.loadFormEdit()
      } else {
        this.formType = 'create'
        await this.loadFormOdoo()
      }
    }
    this.loadingForm = false
  },
  methods: {
    async handleUploadFolder(res) {
    },
    async uploadFolder360({ file, fileList }) {
      const { url, path } = await request({
        url: `${config.api.minio}?name=${file.name}`,
        method: 'get'
      })

      await fetch(url, {
        method: 'put',
        body: file.originFileObj,
        headers: {
          'Content-Type': 'image/jpeg'
        }
      })

      this.form.img360.push(path)
      this.form.img360.sort((a, b) => {
        if (a.slice(0, -19).length < b.slice(0, -19).length) {
          return -1
        } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
          return a.slice(0, -19).localeCompare(b.slice(0, -19))
        } else {
          return 1
        }
      })
    },
    async uploadFolder360in({ file, fileList }) {
      const { url, path } = await request({
        url: `${config.api.minio}?name=${file.name}`,
        method: 'get'
      })

      await fetch(url, {
        method: 'put',
        body: file.originFileObj,
        headers: {
          'Content-Type': 'image/jpeg'
        }
      })

      this.form.img360in.push(path)
      this.form.img360in.sort((a, b) => {
        if (a.slice(0, -19).length < b.slice(0, -19).length) {
          return -1
        } else if (a.slice(0, -19).length === b.slice(0, -19).length) {
          return a.slice(0, -19).localeCompare(b.slice(0, -19))
        } else {
          return 1
        }
      })
    },
    beforeUploadVideo(file) {
      const isAudio = file.type === 'video/mp4'
      this.videoErorr = ''
      if (!isAudio) {
        this.videoErorr = `${file.name} không đúng định dạng!`
      } else {
        this.videoErorr = ''
      }
    },
    async handleUploadVideo(res) {
      this.form.video = undefined
      this.loadingUploadVideo = true
      if (!this.videoErorr) {
        const file = res.file
        const { url, path } = await request({
          url: `${config.api.minio}?name=${file.name}`,
          method: 'get'
        })

        await fetch(url, {
          method: 'put',
          body: file,
          headers: {
            'Content-Type': 'video/mp4'
          }
        })
        this.form.video = path
      }
      this.loadingUploadVideo = false
      return Promise.resolve()
    },
    beforeUploadAudio(file) {
      const isAudio = file.type === 'audio/mpeg'
      this.audioErorr = ''
      if (!isAudio) {
        this.audioErorr = `${file.name} không phải mp3 file!`
      } else {
        this.audioErorr = ''
      }
    },
    async handleUploadFile(res) {
      this.form.engineSound = undefined
      this.loadingUploadAudio = true
      if (!this.audioErorr) {
        const file = res.file
        const { url, path } = await request({
          url: `${config.api.minio}?name=${file.name}`,
          method: 'get'
        })

        await fetch(url, {
          method: 'put',
          body: file,
          headers: {
            'Content-Type': 'audio/mpeg'
          }
        })
        this.form.engineSound = path
      }
      this.loadingUploadAudio = false
      return Promise.resolve()
    },
    removeAllImgDetails() {
      this.form.imgDetail = []
    },
    removeAllImg360() {
      this.form.img360 = []
    },
    removeImg360FormEdit(path, index) {
      this.form.img360.splice(index, 1)
    },
    removeImg360inFormEdit(path, index) {
      this.form.img360in.splice(index, 1)
    },
    removeImgDetailFormEdit(path, index) {
      this.form.imgDetail.splice(index, 1)
    },
    removeVideo(err, file) {
      this.form.video = ''
    },
    onChangeManufacturer() {
      this.form.attributes.brand = undefined
    },
    async getModelCar() {
      const res = await ModelCarAPI.get({ perPage: 10000, active: 1 })
      this.listModelCar = res.data
    },
    removeImgDetail(err, file) {
      const obj = this.form.imgDetail.find(item => item.includes(file.filenameWithoutExtension))
      const index = this.form.imgDetail.indexOf(obj)
      this.form.imgDetail.splice(index, 1)
    },
    removeImgCover(err, file) {
      this.form.imgCover = undefined
    },
    removeMp3File(err, file) {
      this.form.engineSound = ''
    },
    removeImg360(err, file) {
      const obj = this.form.img360.find(item => item.includes(file.filenameWithoutExtension))
      const index = this.form.img360.indexOf(obj)
      this.form.img360.splice(index, 1)
    },
    removeImg360in(err, file) {
      const obj = this.form.img360in.find(item => item.includes(file.filenameWithoutExtension))
      const index = this.form.img360in.indexOf(obj)
      this.form.img360in.splice(index, 1)
    },
    addImg(type) {
      this.formTypeImg = type
      this.dialogImgVisible = true
    },
    async getManufacturer() {
      const res = await ManufacturerAPI.get({ perPage: 1000, active: 1 })
      this.listManufacturer = res.data
    },
    async getBrand(val) {
      if (val) {
        this.listBrand = await BrandAPI.getBrandByManufacturer(val, { active: 1 })
      }
    },
    async getColor() {
      const res = await ColorAPI.get({ perPage: 1000, active: 1 })
      this.colorList = res.data
    },
    async getPropertiesCar() {
      const figure = await FigureAPI.get({ perPage: 1000, active: 1 })
      this.listFigure = figure.data
      const drive = await DriveAPI.get({ perPage: 1000, active: 1 })
      this.listDrive = drive.data
      const fuel = await FuelAPI.get({ perPage: 1000, active: 1 })
      this.listFuel = fuel.data
      const gear = await GearAPI.get({ perPage: 1000, active: 1 })
      this.listGear = gear.data
      const origin = await OriginAPI.get({ perPage: 1000, active: 1 })
      this.listOrigin = origin.data
    },
    async loadFormOdoo() {
      try {
        this.loadingForm = true
        const media = await CarAPI.getMediaById(this.mediaCarId)
        const data = { ...media.carOdooId }
        this.dataOdoo = { ...media.carOdooId }
        this.loadingForm = false
        this.form = {
          active: data.active || 1,
          branch: data.branch || '',
          salePolicy: data.salePolicy || '',
          certification: data.certification || 1,
          carOdooId: data._id?.toString() || '',
          listedPrice: data.listedPrice || 0,
          img360: media.img360 || [],
          img360in: media.img360in || [],
          video: media.video || '',
          engineSound: media.engineSound || '',
          status: 1,
          name: data.name || '',
          price: data.price || 0,
          province: data.province || "",
          ownerNumber: data.ownerNumber || '',
          odo: data.odo || 0,
          licensePlates: data.licensePlates || '',
          imgCover: media.imgCover || '',
          imgDetail: media.imgDetail || [],
          note: data.note || '',
          nicePlateNumber: data.nicePlateNumber || 0,
          plateNumberType: data.plateNumberType || '',
          plateNumberColor: data.plateNumberColor || '',
          vinNumber: data.vinNumber || '',
          color: data?.colorId || data?.colorId?._id,
          attributes: {
            manufacturer: data.manufacturerId || data.manufacturerId?._id,
            brand: data.brandId || data.brandId?._id,
            drive: data.driveId || data.driveId?._id,
            figure: data.figureId || data.figureId?._id,
            fuel: data.fuelId || data.fuelId?._id,
            gear: data.gearId || data.gearId?._id,
            origin: data.originId || data.originId?._id,
            year: data.year || '',
            engine: data.engine || '',
            numberSeat: data.numberSeat || '',
            version: data.version || '',
            cc: data.cc || '',
            horsePower: data.horsePower || '',
            torque: data.torque || '',
            size: data.size || ''
          },
          general: data.general || '',
          highlights: data.highlights || '',
          warrantyPolicy: data.warrantyPolicy || '',
          warrantyNetwork: data.warrantyNetwork || '',
          promotion: data.promotion || '',
          saveTemplate: 0
        }
        if (data.proposedDate) {
          this.form.proposedDate = data.proposedDate
        }
        if (data.state) {
          switch (data.state) {
            case 7:
              this.form.status = 1
              break
            case 8:
              this.form.status = 1
              break
            case 9:
              this.form.status = 1
              break
            case 10:
              this.form.status = 2
              break
            case 11:
              this.form.status = 3
              break
            case 12:
              this.form.status = 4
              break
            default:
              this.form.status = 1
              break
          }
        }
        if (this.form.licensePlates) {
          this.onBSXBlur()
        }
        if (this.form.imgCover) {
          this.imageCover = [await this.getImageFilePreview(this.form.imgCover)]
        }
      } catch (err) {
        console.log(err)
        this.loadingForm = false
      }
    },
    async loadFormEdit() {
      try {
        this.loadingForm = true
        const data = await CarAPI.getById(this.mediaCarId)
        this.dataOdoo = data.carOdooId
        this.loadingForm = false
        this.form = {
          ...data,
          video: data.video,
          color: data?.color?._id,
          attributes: {
            ...data.attributes,
            manufacturer: data.attributes.manufacturer?._id,
            brand: data.attributes.brand?._id,
            drive: data.attributes.drive?._id,
            figure: data.attributes.figure?._id,
            fuel: data.attributes.fuel?._id,
            gear: data.attributes.gear?._id,
            origin: data.attributes.origin?._id,
          }
        }
        if (!data.img360in) {
          this.form.img360in = []
        }
        if (this.formType === 'virtual') {
          this.form.status = 3
          this.form.imgCover = ''
          this.form.imgDetail = []
          this.form.img360 = []
          this.form.img360in = []
        }
        if (this.form.imgCover) {
          this.imageCover = [await this.getImageFilePreview(this.form.imgCover)]
        }
      } catch (err) {
        console.log(err)
        this.loadingForm = false
      }
    },
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    onBSXBlur() {
      const bsx = this.form.licensePlates.trim().replace(/[._-]/g, '').replace(/\s/g, '').toUpperCase()
      this.form.licensePlates = bsx
      if (bsx.length > 1) {
        const DS = this.form.licensePlates.substring(0, 2)
        if (parseInt(DS[0]) === 0) {
        } else if (parseInt(DS) > 28 && parseInt(DS) < 34 || parseInt(DS) === 40) {
          this.form.plateNumberType = 1
        } else if (parseInt(DS) > 49 && parseInt(DS) < 60 || parseInt(DS) === 41) {
          this.form.plateNumberType = 2
        } else {
          this.form.plateNumberType = 3
        }
      }
    },
    handleAdd(type) {
      this.typeProperties = type
      this.dialogFormVisible = true
    },
    onCreateData(res) {
      const { type, data } = res
      switch (type) {
        case config.specType.manufacturer: {
          this.form.attributes.manufacturer = data._id
          break
        }
        case config.specType.brand: {
          this.form.attributes.brand = data._id
          break
        }
        case config.specType.color: {
          this.form.color = data._id
          break
        }
        case config.specType.figure: {
          this.form.attributes.figure = data._id
          break
        }
        case config.specType.fuel: {
          this.form.attributes.fuel = data._id
          break
        }
        case config.specType.drive: {
          this.form.attributes.drive = data._id
          break
        }
        case config.specType.origin: {
          this.form.attributes.origin = data._id
          break
        }
        case config.specType.gear: {
          this.form.attributes.gear = data._id
          break
        }
      }
    },
    async updateVisiable(e) {
      this.dialogFormVisible = e.data.visible
      switch (e.data.typeProp) {
        case config.specType.manufacturer: {
          await this.getManufacturer()
          break
        }
        case config.specType.brand: {
          await this.getBrand(this.form.attributes.manufacturer)
          break
        }
        case config.specType.color: {
          await this.getColor()
          break
        }
        default:
          await this.getPropertiesCar()
          break
      }
    },
    handleCancel() {
      this.$router.push('/quan-ly-xe/danh-sach')
    },
    handleUpdateMedia(data) {
      if (data.cover) this.form.imgCover = data.cover
      if (data.details.length > 0) this.form.imgDetail = data.details
      if (data.img360out.length > 0) this.form.img360 = data.img360out
      if (data.img360in.length > 0) this.form.img360in = data.img360in
      if (data.video) this.form.video = data.video
      if (data.engineSound) this.form.engineSound = data.engineSound
    },
    handleLoadingUpMedia(data) {
      this.loadingUpMedia = data.loading
    },
    async handleSubmit() {
      await this.$refs.form.validate(async(valid, messages) => {
        if (valid) {
          this.formMessage = []
          if (!this.audioErorr) {
            this.form.ownerNumber = this.form.ownerNumber || 1
            const dataSubmit = {
              mediaId: this.mediaCarId,
              ...this.form,
              carOdooId: this.form.carOdooId._id || this.dataOdoo._id,
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
              }
            }
            if (this.saveModel) {
              dataSubmit.saveTemplate = 1
            }
            switch (this.formType) {
              case 'create':
                await CarAPI.create(dataSubmit)
                this.$router.push('/quan-ly-xe/danh-sach')
                break
              case 'edit':
                await CarAPI.update(this.form._id, dataSubmit)
                this.$router.push('/quan-ly-xe/danh-sach')
                break
            }
          }
        } else {
          for (const mes in messages) {
            this.formMessage.push(messages[mes][0].message)
          }
        }
      })
    },
  }
}
</script>

<style lang="scss">
.news-form-container {
  padding: 20px;
}

.file-pond1 {
  width: 100% !important;
}

.img-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.img-360-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}

.img-item {
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  border-radius: 5px;
}

.icon-remove-img {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 9;
  cursor: pointer;

  i {
    font-size: 24px;
    color: white;
  }
}

.icon-remove-img-cover {
  left: 5px;
}

.icon-remove-img:hover {
  i:hover {
    color: #f56c6c;
    cursor: pointer;
  }
}

.ant-upload-list {
  display: none !important;
}

.ant-btn {
  &:hover, &:active, &:focus {
    color: #0A9F46 !important;
    border-color: #0A9F46 !important;
  }
}

@media only screen and (min-width: 768px) {
  .not-hidden-sm-only {
    display: block !important
  }
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .not-hidden-md-only {
    display: block !important
  }
}

.color-div {
  height: 40px;
  width: 40px;
  margin-left: 5px;
  aspect-ratio: 1/1;
  border-radius: 5px;
  display: block;
  border: #C0C4CC 1px solid;
}

.one-img {
  object-fit: cover;
  border-radius: 5px;
}

</style>
