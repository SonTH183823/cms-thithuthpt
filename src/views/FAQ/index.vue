 <template>
   <div class="app-container">
     <el-dialog
       :title="formType === 'create' ? 'Thêm câu hỏi mới' : 'Trả lời câu hỏi'"
       :visible.sync="dialogFormVisible"
       :close-on-click-modal=false
       :show-close="false"
       center
       width="70%"
       top="2vh"
     >
      <el-form ref="form" :model="form" :rules="formRules" label-width="60px" label-position="top">
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :xl="12" :lg="12">
            <el-form-item sortable class="banner-attri" label="Kích hoạt" prop="active">
              <el-switch v-model="form.active" :active-value="1" :inactive-value="0" active-color="#13ce66"
                         style="margin-right: 10px;"
              />
            </el-form-item>
            <el-form-item class="banner-attri" label="Câu hỏi" prop="question">
              <el-input type="textarea" :rows="7" v-model="form.question"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :lg="12">
            <el-form-item
              label="Đề mục"
              label-width="150px"
              prop="categories"
            >
              <el-checkbox v-model="checkbox.general">
                <el-tag type="info">Chung</el-tag>
              </el-checkbox>
              <el-checkbox v-model="checkbox.buy">
                <el-tag>Mua xe</el-tag>
              </el-checkbox>
              <el-checkbox v-model="checkbox.sell">
                <el-tag type="warning">Bán xe</el-tag>
              </el-checkbox>
              <el-checkbox v-model="checkbox.qa" :disabled="true">
                <el-tag type="danger">Q&A</el-tag>
              </el-checkbox>
            </el-form-item>
            <el-form-item class="banner-attri" label="Ngày hỏi">
              <el-input :value="form.questionTime? formatTime(form.questionTime) : ''" disabled></el-input>
            </el-form-item>
            <el-form-item class="banner-attri" label="Ngày trả lời">
              <el-input :value="form.answerTime ? formatTime(form.answerTime) : ''" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :xl="24" :lg="24">
            <el-form-item class="banner-attri" label="Câu trả lời" prop="answer">
              <EditorComponent
                v-if="dialogFormVisible && formType!==''"
                :content="form.answer"
                :type-form="formType"
                @content-html-change="handleHTML"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">{{ formType === 'create' ? 'Thêm mới' : 'Trả lời' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <table-pagination
      ref="tableData"
      :url="url"
      :is-search-date-range="false"
    >
      <template slot="action">
        <el-button
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          Thêm câu hỏi mới
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          border
          :data="scope.tableData"
          style="width: 100%; font-size: 0.8rem; overflow: auto;"
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="STT"
            align="center"
            fixed="left"
            min-width="50"
            :index="indexMethod"
          />
          <el-table-column label="Câu hỏi" align="center" min-width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.question">
                <div class="col-answer">
                  {{ scope.row.question }}
                </div>
                <!--                <div style="font-weight: bold; color: #0A9F46; font-style: italic; cursor: pointer"-->
                <!--                     @click="handleShowDetails(scope.row)"-->
                <!--                >Xem chi tiết-->
                <!--                </div>-->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Đề mục" align="center" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.categories">
                <el-tag
                  style=" margin-bottom: 5px; margin-right: 5px"
                  v-for="item in scope.row.categories"
                  :key="item"
                  :type="config.category[item - 1].typeTag"
                >
                  {{ config.category[item - 1].label }}
                </el-tag>
              </div>
            </template>

          </el-table-column>
          <el-table-column label="Người hỏi" align="center" min-width="70">
            <template slot-scope="scope">
              <div v-if="scope.row.userType === 2">
                ADMIN {{ scope.row.questionUserName }}
              </div>
              <div v-if="scope.row.userType === 3">
                Ẩn danh
              </div>
              <div v-if="scope.row.userType === 1">
                {{ scope.row.questionUserName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Ảnh đại diện" align="center">
            <template slot-scope="scope">
              <img
                v-if="scope.row.questionUserAvatar"
                style="width:80px; height: auto"
                :src="scope.row.questionUserAvatar.substring(0,4) === 'http' ? `${scope.row.questionUserAvatar}` : config.api.domainUpload + '/' + scope.row.questionUserAvatar"
              />
            </template>
          </el-table-column>
          <el-table-column label="Câu trả lời" align="center" min-width="250">
            <template slot-scope="scope">
              <div v-if="scope.row.answer">
                <div class="col-answer"
                     v-html="scope.row.answer.replace(/<img[^>]*>/g,'{image}').replace(/<video[^>]*>/g,'{video}').replace('Your browser does not support HTML5 video.', '')"
                ></div>
              </div>
              <el-button v-else type="primary" size="small" @click="handleEdit(scope.row)">Trả lời ngay</el-button>
            </template>
          </el-table-column>
          <el-table-column label="Ngày trả lời" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.answerTime ? formatTime(scope.row.answerTime) : '' }}
            </template>
          </el-table-column>
          <template v-for="column in columnsMap1">
            <search-column
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :type="column.type"
              :fixed="column.fixed"
              :search-remote="handleSearch"
            />
          </template>
          <el-table-column
            align="center" label="Tác vụ" width="130" fixed="right"
          >
            <template slot-scope="scope">
              <el-tooltip content="Sửa" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handleEdit(scope.row)"
                >
                  <i class="el-icon-edit"/>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Xóa" placement="top">
                <el-popconfirm
                  style="margin-left: 5px"
                  confirm-button-text="Đồng ý"
                  cancel-button-text="Hủy"
                  title="Bạn có chắc chắn xóa?"
                  @onConfirm="handleDelete(scope.row)"
                >
                  <el-button
                    slot="reference"
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                  />
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-pagination>
  </div>
</template>

<script>
import config from '@/utils/config'
import moment from 'moment'
import TablePagination from "@/components/TablePagination"
import { handleSearchInTable } from "@/utils"
import SearchColumn from "@/components/SearchColumn"
import FAQAPI from "@/api/faqApi"
import { validText } from "@/utils/validate"
import EditorComponent from "@/components/Editor"

moment.locale('vi')
export default {
  components: {
    TablePagination,
    SearchColumn,
    EditorComponent
  },
  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đủ trường!'))
      } else {
        callback()
      }
    }
    const validateChose = (rule, value, callback) => {
      if (this.form.categories.length < 1) {
        callback(new Error('Vui lòng chọn đề mục!'))
      } else {
        callback()
      }
    }
    return {
      url: `${config.api.domainFaq}/faq`,
      config,
      columnsMap1: [
        {
          label: 'Ngày hỏi',
          prop: 'questionTime',
          type: 'date',
          minWidth: '80',
        },
        {
          label: 'Kích hoạt',
          prop: 'active',
          type: 'config',
          minWidth: '100',
        },
      ],
      tableData: [],
      form: {
        question: '',
        answer: '',
        categories: [],
        active: 1,
        questionTime: '',
        answerTime: ''
      },
      formRules: {
        question: [{ required: true, trigger: 'blur', validator: validateText }],
        questionTime: [{ required: true, trigger: 'blur', validator: validateText }],
        answerTime: [{ required: true, trigger: 'blur', validator: validateText }],
        answer: [{ required: true, trigger: 'blur', validator: validateText }],
        categories: [{ required: true, trigger: 'blur', validator: validateChose }],
        active: [{ required: true, trigger: 'blur', validator: validateText }],
      },
      dialogFormVisible: false,
      dialogFormVisibleDetails: false,
      formType: '',
      categories: [],
      checkbox: {
        general: false,
        buy: false,
        sell: false,
        qa: false
      },
      hasQA: false,
      answerDetails: '',
      questionDetail: ''
    }
  },
  methods: {
    formatTime(time) {
      return moment(time * 1000).format('DD/MM/YYYY')
    },
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    handleEdit(prams) {
      this.formType = 'edit'
      this.form = { ...prams }
      this.form.answerTime = Math.floor(new Date().getTime() / 1000)
      this.form.categories?.map(item => {
        if (item === 4) this.checkbox.general = true
        if (item === 1) this.checkbox.buy = true
        if (item === 2) this.checkbox.sell = true
        if (item === 3) {
          this.checkbox.qa = true
          this.hasQA = true
        }
      })
      this.dialogFormVisible = true
    },
    async handleDelete(prams) {
      try {
        await FAQAPI.delete(prams._id)
        this.$refs.tableData.refreshData('del')
      } catch (err) {
        console.log(err)
      }
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.refreshData()
    },
    handleHTML(data) {
      this.form.answer = data
    },
    handleAdd() {
      this.formType = 'create'
      this.dialogFormVisible = true
      this.form = {
        question: '',
        answer: '',
        active: 1,
        categories: [],
        questionTime: Math.floor(new Date().getTime() / 1000),
        answerTime: Math.floor(new Date().getTime() / 1000),
      }
    },
    async handleSubmit() {
      this.form.categories = []
      if (this.hasQA) {
        this.form.categories.push(3)
        this.hasQA = false
      }
      if (this.checkbox.general) this.form.categories.push(4)
      if (this.checkbox.buy) this.form.categories.push(1)
      if (this.checkbox.sell) this.form.categories.push(2)
      await this.$refs.form.validate(async valid => {
        if (valid) {
          const data = {
            question: this.form.question,
            questionTime: this.form.questionTime,
            categories: this.form.categories,
            active: this.form.active
          }
          if (this.form.answer) {
            data.answer = this.form.answer
            data.answerTime = this.form.answerTime
          }
          if (this.formType === 'create') {
            await FAQAPI.create(data)
            this.$refs.tableData.refreshData()
          } else {
            await FAQAPI.update(this.form._id, data)
            this.$refs.tableData.refreshData('edit')
          }
          this.refreshData()
          this.dialogFormVisible = false
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    refreshData() {
      this.form = {
        question: '',
        answer: '',
        active: 1,
        categories: [],
      }
      this.checkbox = {
        general: false,
        buy: false,
        sell: false,
        qa: false
      }
    },
    indexMethod(index) {
      return index + 1
    },
  }
}
</script>
<style scoped lang="scss">
.col-answer {
  max-height: 200px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

