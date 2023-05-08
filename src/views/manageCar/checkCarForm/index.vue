<template>
  <div v-loading="loadingForm" class="news-form-container">
    <el-row>
      <h2 style="font-weight: bold; margin-top: 5px">Kiểm định xe
        ({{ formType === 'edit' ? 'Chỉnh sửa' : 'Tạo mới' }})</h2>
    </el-row>
    <el-row>
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-tabs type="border-card" value="first">
          <el-tab-pane name="first">
            <span slot="label" style="font-weight: bold">KIẾM ĐỊNH KỸ THUẬT</span>
            <el-row>
              <UploadFolder @loading-upload="handleLoadingFolder" @update-images="handleUpdateImages"/>
            </el-row>
            <div v-loading="loadingUploadImages" element-loading-text="Đang tải">
              <h3 style="color: #0A9F46; font-weight: bold">Ảnh sơ đồ các vị trí kiểm định</h3>
              <el-row v-if="typeCar === 'virtual'" :gutter="20" style="margin-bottom: 20px;">
                <el-col :xl="12" :lg="12">
                  <el-form-item label="Cửa xe">
                    <div v-if="form.carDoor.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.carDoor"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'carDoor')">
                          <el-icon name="error"/>
                        </span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('carDoor')">
                        {{ form.carDoor.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh cửa xe ({{
                          form.carDoor.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="carDoorDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Nắp Capo">
                    <div v-if="form.capo.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.capo"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                          alt=""
                        >
                        <span
                          class="icon-remove-img"
                          @click="removeImgFormEdit(path, idx,'capo')"
                        >
                          <el-icon name="error"/>
                        </span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('capo')">
                        {{ form.capo.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh nắp capo ({{ form.capo.length || 0 }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="capoDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Cốp xe">
                    <div v-if="form.carTrunk.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.carTrunk"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'carTrunk')"><el-icon
                          name="error"
                        /></span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('carTrunk')">
                        {{ form.carTrunk.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh cốp xe ({{
                          form.carTrunk.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="carTrunkDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Động cơ">
                    <div v-if="form.engine.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.engine"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span
                          class="icon-remove-img"
                          @click="removeImgFormEdit(path, idx,'engine')"
                        >
                          <el-icon name="error"/>
                        </span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('engine')">
                        {{ form.engine.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh động cơ ({{
                          form.engine.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="engineDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :xl="12" :lg="12">
                  <el-form-item label="Ốc máy">
                    <div v-if="form.engineCrew.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.engineCrew"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'engineCrew')"><el-icon
                          name="error"
                        /></span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('engineCrew')">
                        {{ form.engineCrew.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh ốc máy
                        ({{ form.engineCrew.length || 0 }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="engineCrewDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Gầm xe">
                    <div v-if="form.bottomCar.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.bottomCar"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'bottomCar')"><el-icon
                          name="error"
                        /></span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('bottomCar')">
                        {{ form.bottomCar.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh gầm xe ({{
                          form.bottomCar.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="bottomCarDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Lốp xe">
                    <div v-if="form.tireCar.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.tireCar"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'tireCar')">
                          <el-icon name="error"/>
                        </span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('tireCar')">
                        {{ form.tireCar.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh lốp xe ({{
                          form.tireCar.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="tireCarDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Lốp sơ cua">
                    <div v-if="form.spareTire.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.spareTire"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'spareTire')">
                          <el-icon name="error"/>
                        </span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('spareTire')">
                        {{ form.spareTire.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh lốp sơ cua
                        ({{ form.spareTire.length || 0 }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="spareTireDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-else :gutter="20" style="margin-bottom: 20px;">
                <el-col :xl="12" :lg="12">
                  <el-form-item label="Cửa xe" prop="carDoor">
                    <div v-if="form.carDoor.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.carDoor"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                          alt=""
                        >
                        <span
                          class="icon-remove-img"
                          @click="removeImgFormEdit(path, idx,'carDoor')"
                        >
                          <el-icon name="error"/></span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('carDoor')">
                        {{ form.carDoor.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh cửa xe ({{
                          form.carDoor.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="carDoorDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Nắp Capo" prop="capo">
                    <div v-if="form.capo.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.capo"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'capo')">
                          <el-icon name="error"/>
                        </span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('capo')">
                        {{ form.capo.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh nắp capo ({{ form.capo.length || 0 }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="capoDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Cốp xe" prop="carTrunk">
                    <div v-if="form.carTrunk.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.carTrunk"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                          alt=""
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'carTrunk')"><el-icon
                          name="error"
                        /></span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('carTrunk')">
                        {{ form.carTrunk.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh cốp xe ({{
                          form.carTrunk.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="carTrunkDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Động cơ" prop="engine">
                    <div v-if="form.engine.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.engine"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'engine')">
                          <el-icon name="error"/>
                        </span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('engine')">
                        {{ form.engine.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh động cơ ({{
                          form.engine.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="engineDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :xl="12" :lg="12">
                  <el-form-item label="Ốc máy" prop="engineCrew">
                    <div v-if="form.engineCrew.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.engineCrew"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'engineCrew')"><el-icon
                          name="error"
                        /></span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('engineCrew')">
                        {{ form.engineCrew.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh ốc máy
                        ({{ form.engineCrew.length || 0 }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="engineCrewDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Gầm xe" prop="bottomCar">
                    <div v-if="form.bottomCar.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.bottomCar"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'bottomCar')"><el-icon
                          name="error"
                        /></span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('bottomCar')">
                        {{ form.bottomCar.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh gầm xe ({{
                          form.bottomCar.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="bottomCarDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Lốp xe" prop="tireCar">
                    <div v-if="form.tireCar.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.tireCar"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'tireCar')"><el-icon
                          name="error"
                        /></span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('tireCar')">
                        {{ form.tireCar.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh lốp xe ({{
                          form.tireCar.length || 0
                        }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="tireCarDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="Lốp sơ cua" prop="spareTire">
                    <div v-if="form.spareTire.length > 0" class="img-list-grid">
                      <div
                        v-for="(path, idx) in form.spareTire"
                        :key="'img-details' + idx"
                        class="img-item"
                      >
                        <img
                          :src="`${config.api.domainUpload}/${path}`"
                          width="100%"
                          height="200px"
                          style="object-fit: cover;border-radius: 5px;"
                        >
                        <span class="icon-remove-img" @click="removeImgFormEdit(path, idx,'spareTire')"><el-icon
                          name="error"
                        /></span>
                      </div>
                    </div>
                    <img
                      v-else
                      src="../../../assets/images/image_placeholder.png"
                      width="auto"
                      height="200px"
                      alt=""
                      style="object-fit: cover;border-radius: 5px;"
                    >
                    <div class="el-row--flex">
                      <el-button type="text" @click="addImg('spareTire')">
                        {{ form.spareTire.length === 0 ? 'Thêm' : 'Chỉnh sửa' }} ảnh lốp sơ cua
                        ({{ form.spareTire.length || 0 }})
                      </el-button>
                    </div>
                    <div style="display: flex; flex-direction: column">
                      <span style="font-weight: bold"> Chú thích:</span>
                      <el-input
                        v-model="spareTireDescription"
                        type="textarea"
                        style="width: 80%"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="Nhập chú thích"
                      />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label" style="font-weight: bold">160 ĐIỂM KIỂM ĐỊNH</span>
            <el-form-item label="Người kiểm định" prop="inspector">
              <el-input
                v-model="form.inspector"
                placeholder="Nhập tên người kiểm định"
              />
            </el-form-item>
            <el-form-item label="Tính năng công nghệ" prop="techFeatures">
              <div
                v-for="(item, idx) in form.techFeatures"
                style="display: flex; flex-direction: row; margin-bottom: 10px; margin-left: 10px"
              >
                <div>Tính năng {{ idx + 1 }}</div>
                <div style="display: flex; flex-direction: row; flex: 1; margin-left: 10px">
                  <el-input
                    v-model="form.techFeatures[idx]"
                    class="input-tech-features"
                    :placeholder="errorTechFeatures ? 'Hãy nhập tính năng này!': ''"
                  />
                  <div style="display: flex; flex-direction: row; margin-left: 10px">
                    <el-button
                      :disabled="form.techFeatures[idx] === ''"
                      type="primary"
                      plain
                      circle
                      icon="el-icon-plus"
                      @click="handleAddTechFeatures(idx)"
                    />
                    <el-button
                      v-if="form.techFeatures.length > 1"
                      type="danger"
                      circle
                      icon="el-icon-delete"
                      @click="handleDelTechFeatures(idx)"
                    />
                  </div>
                </div>
              </div>

            </el-form-item>

            <el-form-item label="Thông tin kiểm định">
              <el-collapse v-for="(item, idx) in inspectionPoints" v-model="activeNames">
                <el-collapse-item class="one-inspection-points" :name="idx.toString()">
                  <template slot="title">
                    <div style="font-weight: bold; font-size: 18px">{{ item.name }}</div>
                  </template>
                  <div v-if="item.childs && item.childs.length > 0" class="one-child" style="margin-bottom: 20px">
                    <div v-for="child in item.childs">
                      <div style="font-weight: bold; font-size: 16px ; margin-top: 10px">{{ child.name }}</div>
                      <div v-for="p in child.points" class="one-child">
                        <PointComponent :points="p" @point-change="onePointChange"/>
                      </div>
                    </div>
                  </div>
                  <div v-for="p in item.points" class="one-child">
                    <PointComponent :points="p" @point-change="onePointChange"/>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item style="margin-top: 30px">
          <div v-if="formMessage.length > 0">
            <div v-for="mes in formMessage">
              <li style="color: #f56c6c">{{ mes }}</li>
            </div>
            <div style="color: #f56c6c">Hãy nhập đầy đủ thông tin!</div>
          </div>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-dialog
      :title="`Thêm ảnh `+ titleForm"
      :visible.sync="dialogImgVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <div>
        <file-pond
          v-if="formTypeImg === 'carDoor'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="carDoor"
          :server="serverCarDoor"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === 'carDoor' && form.carDoor.length > 0" class="img-list-grid">
          <div
            v-for="(path, idx) in form.carDoor"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              style="object-fit: cover;border-radius: 5px;"
            >
            <span class="icon-remove-img" @click="removeImgFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>

        <file-pond
          v-if="formTypeImg === 'capo'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="capo"
          :server="serverCapo"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === 'capo' && form.capo.length > 0" class="img-list-grid">
          <div
            v-for="(path, idx) in form.capo"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              style="object-fit: cover;border-radius: 5px"
            >
            <span class="icon-remove-img" @click="removeImgFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>

        <file-pond
          v-if="formTypeImg === 'carTrunk'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="carTrunk"
          :server="serverCarTrunk"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === 'carTrunk' && form.capo.length > 0" class="img-list-grid">
          <div
            v-for="(path, idx) in form.carTrunk"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              style="object-fit: cover;border-radius: 5px"
            >
            <span class="icon-remove-img" @click="removeImgFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>

        <file-pond
          v-if="formTypeImg === 'bottomCar'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="bottomCar"
          :server="serverBottomCar"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === 'bottomCar' && form.bottomCar.length > 0" class="img-list-grid">
          <div
            v-for="(path, idx) in form.bottomCar"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              style="object-fit: cover;border-radius: 5px;"
            >
            <span class="icon-remove-img" @click="removeImgFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>

        <file-pond
          v-if="formTypeImg === 'engine'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="engine"
          :server="serverEngine"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === 'engine' && form.engine.length > 0" class="img-list-grid">
          <div
            v-for="(path, idx) in form.engine"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              style="object-fit: cover;border-radius: 5px;"
            >
            <span class="icon-remove-img" @click="removeImgFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>

        <file-pond
          v-if="formTypeImg === 'engineCrew'"
          ref="pond"
          allow-image-preview="flase"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="engineCrew"
          :server="serverEngineCrew"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === 'engineCrew' && form.engineCrew.length > 0" class="img-list-grid">
          <div
            v-for="(path, idx) in form.engineCrew"
            :key="'img-360' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              style="object-fit: cover;border-radius: 5px;"
            >
            <span class="icon-remove-img" @click="removeImgFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>
        <file-pond
          v-if="formTypeImg === 'tireCar'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="tireCar"
          :server="serverTireCar"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === 'tireCar' && form.tireCar.length > 0" class="img-list-grid">
          <div
            v-for="(path, idx) in form.tireCar"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              style="object-fit: cover;border-radius: 5px;"
            >
            <span class="icon-remove-img" @click="removeImgFormEdit(path, idx)">
              <el-icon name="error"/>
            </span>
          </div>
        </div>

        <file-pond
          v-if="formTypeImg === 'spareTire'"
          ref="pond"
          allow-image-preview="false"
          class-name="file-pond1"
          name="file"
          label-idle="Tải lên ảnh"
          allow-remove="true"
          allow-multiple="true"
          accepted-file-types="image/*"
          label-file-type-not-allowed="Không đúng định dạng ảnh"
          :files="spareTire"
          :server="serverSpareTire"
          credits="false"
          instant-upload="true"
        />
        <div v-if="formTypeImg === 'spareTire' && form.spareTire.length > 0" class="img-list-grid">
          <div
            v-for="(path, idx) in form.spareTire"
            :key="'img-details' + idx"
            class="img-item"
          >
            <img
              :src="`${config.api.domainUpload}/${path}`"
              alt=""
              width="100%"
              height="200px"
              style="object-fit: cover;border-radius: 5px;"
            >
            <span class="icon-remove-img" @click="removeImgFormEdit(path, idx)">
              <el-icon class="icon-remove-image" name="error"/>
            </span>
          </div>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import config from '@/utils/config'
import vueFilePond, { setOptions } from "vue-filepond"
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import PointAPI from "@/api/pointApi"
import MinIOAPI from '@/api/minioApi'
import PointComponent from "@/views/manageCheckCar/PointComponent"
import UploadFolder from "@/views/manageCheckCar/UploadFolder"

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
  components: { FilePond, PointComponent, UploadFolder },
  data() {
    const validateNumber2Img = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('Hãy chọn ảnh Ốc xe!'))
      } else if (value.length > 0 && value.length < 2) {
        callback(new Error('Tối thiểu phải có 2 ảnh!'))
      } else {
        callback()
      }
    }

    const validateNumber3Img = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('Hãy chọn ảnh!'))
      } else if (value.length > 0 && value.length < 3) {
        callback(new Error('Tối thiểu phải có 3 ảnh!'))
      } else {
        callback()
      }
    }

    const validateNumber4Img = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('Hãy chọn ảnh!'))
      } else if (value.length > 0 && value.length < 4) {
        callback(new Error('Tối thiểu phải có 4 ảnh!'))
      } else {
        callback()
      }
    }
    const validateNumber1Img = (rule, value, callback) => {
      console.log(value)
      if (!value || value.length === 0) {
        callback(new Error('Hãy chọn ảnh!'))
      } else {
        callback()
      }
    }

    const validateNumber1 = (rule, value, callback) => {
      if (value.length === 1 && value[0] === '') {
        callback(new Error('Tối thiểu phải có 1 tính năng công nghệ!'))
      } else {
        callback()
      }
    }

    return {
      config,
      titleForm: '',
      listInspectionPoints: [],
      dialogFormVisible: false,
      dialogImgVisible: false,
      formTypeImg: '',
      serverCarDoor: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCheck/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.carDoor.push(data.path)
            this.form.carDoor.sort((a, b) => {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverCapo: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCheck/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.capo.push(data.path)
            this.form.capo.sort((a, b) => {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverCarTrunk: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCheck/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.carTrunk.push(data.path)
            this.form.carTrunk.sort((a, b) => {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverEngine: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCheck/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.engine.push(data.path)
            this.form.engine.sort((a, b) => {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverEngineCrew: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCheck/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.engineCrew.push(data.path)
            this.form.engineCrew.sort((a, b) => {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverBottomCar: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCheck/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.bottomCar.push(data.path)
            this.form.bottomCar.sort((a, b) => {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverTireCar: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCheck/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.tireCar.push(data.path)
            this.form.tireCar.sort((a, b) => {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      serverSpareTire: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: `carCheck/${file.name}` })
            await MinIOAPI.upload(data.url, file)
            this.form.spareTire.push(data.path)
            this.form.spareTire.sort((a, b) => {
              return a.slice(0, -19).localeCompare(b.slice(0, -19))
            })
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      typeProperties: '',
      errorTechFeatures: false,
      carDoorDescription: '- Khe cửa và mép cửa khớp nhau\n' +
        '- Keo chỉ không nứt vỡ, đồng nhất với nhau\n' +
        '- Cửa xe không có dấu hiệu bị chảy xệ, sơn không bị bong tróc\n',
      capoDescription: '- Nắp Capo còn nguyên vẹn \n' +
        '- Viền nắp capo liền mạch, bản lề capo 2 bên nguyên bản\n' +
        '- Chi tiết bên trong không sần sùi, tương đồng với màu sơn\n',
      carTrunkDescription: '- Viền nắp cốp xe không lõm, chắp vá\n' +
        '- Tai hai bên trái phải chưa bị chắp vá, sửa chữa\n' +
        '- Cốp xe nguyên bản không bị móp méo, bong tróc\n',
      engineDescription: '- Phần máy động cơ khô ráo, sạch sẽ\n',
      engineCrewDescription: '- Ốc máy có đánh dấu của nhà sản xuất, hoàn toàn nguyên vẹn chưa bị vặn, tháo\n',
      bottomCarDescription: '- Gầm xe hoàn toàn không gỉ sét\n' +
        '- Toàn bộ ốc còn nguyên vẹn, đầy đủ\n',
      tireCarDescription: '- Lốp xe không nứt vỡ, rách\n',
      spareTireDescription: '- Bộ lốp dự phòng đầy đủ\n',
      form: {
        inspector: '',
        techFeatures: [],
        carDoor: [],
        capo: [],
        carTrunk: [],
        engine: [],
        engineCrew: [],
        bottomCar: [],
        tireCar: [],
        spareTire: []
      },
      carDoor: [],
      capo: [],
      carTrunk: [],
      engine: [],
      engineCrew: [],
      bottomCar: [],
      tireCar: [],
      spareTire: [],
      formRules: {
        carDoor: [{
          required: true,
          trigger: 'blur',
          validator: validateNumber4Img
        }],
        techFeatures: [{
          required: true,
          trigger: 'blur',
          validator: validateNumber1
        }],
        capo: [{
          required: true,
          trigger: 'blur',
          validator: validateNumber3Img
        }],
        carTrunk: [{
          required: true,
          trigger: 'blur',
          validator: validateNumber3Img
        }],
        engineCrew: [{
          required: true,
          trigger: 'blur',
          validator: validateNumber2Img
        }],
        tireCar: [{
          required: true,
          trigger: 'blur',
          validator: validateNumber4Img
        }],
        engine: [{
          required: true,
          trigger: 'blur',
          validator: validateNumber1Img
        }],
        bottomCar: [{
          required: true,
          trigger: 'blur',
          validator: validateNumber1Img
        }],
        inspector: [{
          required: true,
          trigger: 'blur',
          message: 'Người kiểm định không thể bỏ trống!'
        }]
      },
      formType: '',
      typeCar: '',
      loadingUploadImages: false,
      formMessage: [],
      carId: this.$route.params.id,
      loadingForm: false,
      inspectionPoints: {},
      activeNames: [],
      submitData: {
        inspector: "",
        dateOfInspection: Math.floor(Date.now() / 1000),
        carId: this.carId,
        points: {},
        technicalPoints: [],
        techFeatures: []
      }
    }
  },
  async mounted() {
    this.loadingForm = true
    if (this.$router.history.current.query.type === 'virtual') {
      this.typeCar = 'virtual'
    } else {
      this.typeCar = 'real'
    }
    const dataCar = await PointAPI.getInspectionTableByCar(this.carId)
    const data = await PointAPI.getRules()
    this.initSubmitData(data.inspectionPoints, data.technicalPoints)
    if (Object.keys(dataCar).length !== 0) {
      this.submitData._id = dataCar._id
      if (dataCar.inspectionPoints) {
        this.inspectionPoints = dataCar.inspectionPoints
        this.loadFormEditInspectionPoints()
      } else {
        this.inspectionPoints = data.inspectionPoints
      }
      if (dataCar.technicalPoints) {
        this.technicalPoints = dataCar.technicalPoints
        this.loadFormEditTechnicalPoints()
      }
      if (dataCar.techFeatures.length > 0) {
        this.form.techFeatures = dataCar.techFeatures
      } else {
        this.form.techFeatures.push('')
      }
      this.form.inspector = dataCar.inspector
      this.formType = 'edit'
    } else {
      this.formType = 'create'
      this.inspectionPoints = data.inspectionPoints
      this.form.techFeatures.push('')
    }
    for (let i = 0; i < this.inspectionPoints.length; i++) {
      this.activeNames.push(i.toString())
    }
    this.loadingForm = false
  },
  methods: {
    initSubmitData(inspectionPoints, technicalPoints) {
      const objInspectionPoints = {}
      const objTechnicalPoints = {}
      for (const cate of inspectionPoints) {
        // point trong child
        for (const c of cate.childs) {
          for (const p of c.points) {
            objInspectionPoints[p._id] = {
              pointId: p._id,
              quality: config.qualityConfig.PASS,
              images: []
            }
          }
        }
        // point le trong position
        for (const p of cate.points) {
          objInspectionPoints[p._id] = {
            pointId: p._id,
            quality: config.qualityConfig.PASS,
            images: []
          }
        }
      }
      for (const p of technicalPoints) {
        objTechnicalPoints[p.id] = {
          id: p.id,
          images: [],
        }
      }
      this.submitData.points = objInspectionPoints
    },
    removeImgFormEdit(path, index, type) {
      switch (type || this.formTypeImg) {
        case 'carDoor':
          this.form.carDoor.splice(index, 1)
          break
        case 'capo':
          this.form.capo.splice(index, 1)
          break
        case 'carTrunk':
          this.form.carTrunk.splice(index, 1)
          break
        case 'bottomCar':
          this.form.bottomCar.splice(index, 1)
          break
        case 'engine':
          this.form.engine.splice(index, 1)
          break
        case 'engineCrew':
          this.form.engineCrew.splice(index, 1)
          break
        case 'tireCar':
          this.form.tireCar.splice(index, 1)
          break
        case 'spareTire':
          this.form.spareTire.splice(index, 1)
          break
      }
    },
    addImg(type) {
      this.formTypeImg = type
      switch (this.formTypeImg) {
        case 'carDoor':
          this.titleForm = 'cửa xe (tối thiểu 4 ảnh)'
          break
        case 'capo':
          this.titleForm = 'nắp capo (tối thiểu 3 ảnh)'
          break
        case 'carTrunk':
          this.titleForm = 'cốp xe (tối thiểu 3 ảnh)'
          break
        case 'bottomCar':
          this.titleForm = 'gầm xe (tối thiểu 1 ảnh)'
          break
        case 'engine':
          this.titleForm = 'động cơ (tối thiểu 1 ảnh)'
          break
        case 'engineCrew':
          this.titleForm = 'ốc máy (tối thiểu 2 ảnh)'
          break
        case 'tireCar':
          this.titleForm = 'lốp xe (tối thiểu 4 ảnh)'
          break
        case 'spareTire':
          this.titleForm = 'lốp sơ cua (1 ảnh - không bắt buộc)'
          break
      }
      this.dialogImgVisible = true
    },
    loadFormEditTechnicalPoints() {
      this.technicalPoints.map(item => {
        switch (item.id) {
          case '1':
            this.form.carDoor = item.images
            this.carDoorDescription = item.description
            break
          case '2':
            this.form.capo = item.images
            this.capoDescription = item.description
            break
          case '3':
            this.form.carTrunk = item.images
            this.carTrunkDescription = item.description
            break
          case '4':
            this.form.engine = item.images
            this.engineDescription = item.description
            break
          case '5':
            this.form.engineCrew = item.images
            this.engineCrewDescription = item.description
            break
          case '6':
            this.form.bottomCar = item.images
            this.bottomCarDescription = item.description
            break
          case '7':
            this.form.tireCar = item.images
            this.tireCarDescription = item.description
            break
          case '8':
            this.form.spareTire = item.images
            this.spareTireDescription = item.description
            break
        }
      })
    },
    loadFormEditInspectionPoints() {
      for (const item of this.inspectionPoints) {
        if (item.childs) {
          for (const points of item.childs) {
            for (const point of points.points) {
              this.submitData.points[point.point._id] = {
                pointId: point.point._id,
                quality: point.quality,
                images: point.images
              }
            }
          }
        } else {
          for (const point of item.points) {
            this.submitData.points[point.point._id] = {
              pointId: point.point._id,
              quality: point.quality,
              images: point.images
            }
          }
        }
      }
    },
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    handleCancel() {
      if (this.typeCar === 'real') {
        this.$router.push('/quan-ly-xe/danh-sach')
      } else {
        this.$router.push('/quan-ly-xe/danh-sach-xe-ao')
      }
    },
    pushTechnicalPoints() {
      this.submitData.technicalPoints = []
      this.submitData.technicalPoints.push({
        id: "1",
        images: this.form.carDoor,
        description: this.carDoorDescription
      })
      this.submitData.technicalPoints.push({
        id: "2",
        images: this.form.capo,
        description: this.capoDescription
      })
      this.submitData.technicalPoints.push({
        id: "3",
        images: this.form.carTrunk,
        description: this.carTrunkDescription
      })
      this.submitData.technicalPoints.push({
        id: "4",
        images: this.form.engine,
        description: this.engineDescription
      })
      this.submitData.technicalPoints.push({
        id: "5",
        images: this.form.engineCrew,
        description: this.engineCrewDescription
      })
      this.submitData.technicalPoints.push({
        id: "6",
        images: this.form.bottomCar,
        description: this.bottomCarDescription
      })
      this.submitData.technicalPoints.push({
        id: "7",
        images: this.form.tireCar,
        description: this.tireCarDescription
      })
      this.submitData.technicalPoints.push({
        id: "8",
        images: this.form.spareTire,
        description: this.spareTireDescription
      })
    },
    async handleSubmit() {
      await this.$refs.form.validate(async(valid, messages) => {
        if (valid) {
          this.pushTechnicalPoints()
          this.submitData.points = Object.values(this.submitData.points)
          this.submitData.inspector = this.form.inspector
          this.submitData.carId = this.carId
          this.form.techFeatures.map(item => {
            if (item !== '') {
              this.submitData.techFeatures.push(item)
            }
          })
          if (this.formType === 'create') {
            await PointAPI.createInspectionTable(this.submitData)
          } else {
            await PointAPI.updateInspectionTable(this.submitData._id, this.submitData)
          }
          this.handleCancel()
        } else {
          for (const mes in messages) {
            this.formMessage.push(messages[mes][0].message)
          }
        }
      })
    },
    onePointChange(data) {
      const { _id: pointId, quality, images } = data
      this.submitData.points[pointId] = { pointId, quality, images }
    },
    checkAddTechFeatures() {
      for (const item of this.form.techFeatures) {
        if (item === '') {
          return false
        }
      }
      return true
    },
    handleAddTechFeatures(idx) {
      if (this.checkAddTechFeatures()) {
        this.errorTechFeatures = false
        this.form.techFeatures.splice(idx + 1, 0, '')
      } else {
        this.errorTechFeatures = true
      }
    },
    handleDelTechFeatures(idx) {
      this.form.techFeatures.splice(idx, 1)
    },
    handleUpdateImages(data) {
      if (data.carDoor.length > 0) this.form.carDoor = data.carDoor
      if (data.capo.length > 0) this.form.capo = data.capo
      if (data.carTrunk.length > 0) this.form.carTrunk = data.carTrunk
      if (data.engine.length > 0) this.form.engine = data.engine
      if (data.engineCrew.length > 0) this.form.engineCrew = data.engineCrew
      if (data.tireCar.length > 0) this.form.tireCar = data.tireCar
      if (data.spareTire.length > 0) this.form.spareTire = data.spareTire
      if (data.bottomCar.length > 0) this.form.bottomCar = data.bottomCar
    },
    handleLoadingFolder(data) {
      this.loadingUploadImages = data.loading
    }
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

.img-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
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

.icon-remove-img:hover {
  i:hover {
    color: #f56c6c;
    cursor: pointer;
  }
}

.one-child {
  padding-right: 20px;
  padding-left: 20px;
}

.input-tech-features {
  .el-input__inner::-webkit-input-placeholder {
    color: #f56c6c !important;
  }
}

</style>
