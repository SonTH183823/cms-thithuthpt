<template>
  <div>
    <div v-loading="loadingNews" class="news-form-container" :key="`keyquestion-`+key">
      <el-row><h2 style="font-weight: bold">Biên tập câu hỏi đề thi "{{ formSubmit.title }}"</h2></el-row>
      <el-row style="margin-top: 12px;margin-bottom: 20px">
        <el-col style="display: flex; justify-content: space-between; margin-right: 10px">
          <div>
            <!--            <el-button type="warning" @click="handleCancel"> Upload thư mục câu hỏi</el-button>-->
            <upload-folder @loading-upload="Uploading" @update-images="updateImage"/>
          </div>
          <div style="display: flex; justify-content: flex-end">
            <el-button @click="handleCancel">Hủy</el-button>
            <el-button type="primary" class="btn-submit" @click="handleSend">
              {{ formType !== 'edit' ? 'Tạo đề thi' : 'Cập nhật câu hỏi đề thi' }}
            </el-button>
          </div>
        </el-col>
        <div style="color:#f56c6c;">
          <!--            <el-button type="warning" @click="handleCancel"> Upload thư mục câu hỏi</el-button>-->
          <!--            <upload-folder @loading-upload="Uploading" @update-images="updateImage"/>-->
          Lưu ý: Cần phải nhập đủ {{ numberQuestion }} câu hỏi
        </div>
        <div>
          Số câu hỏi hiện tại là {{ listQuestion.length }}
        </div>
      </el-row>
      <el-row>
        <div style="flex-direction: row; font-weight: bold">
          Kích hoạt
          <el-switch
            v-model="formSubmit.active"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            style="margin-left: 10px;"
          />
        </div>
        <div style="margin-top: 20px; font-weight: bold; font-size: 16px">Phân phối đề thi</div>
        <div style="display: flex; justify-content: space-between; padding: 10px 30px; font-weight: bold">
          <span>STT</span>
          <span>Dạng câu hỏi</span>
          <span>Số câu hỏi</span>
        </div>
        <div v-for="(item,index) in listTypeQuestion" style="padding: 0 60px 0 30px; padding-right: 40px">
          <div :key="index" style="display: flex; justify-content: space-between">
            <span>{{ index + 1 }}</span>
            <span>{{ item.label }}</span>
            <span>{{ item.value }}</span>
          </div>
        </div>
        <div v-if="listTypeQuestion.length === 0"
             style="align-items: center; width: 100%; display: flex; justify-content: center"
        >Không có dữ liệu
        </div>
        <h2 style="font-weight: bold; margin-top: 20px">Danh sách câu hỏi</h2>
        <div v-if="listQuestion.length === 0"
             style="align-items: center; width: 100%; display: flex; justify-content: center"
        >
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="handleAddQuestion(0)"
          >Thêm câu hỏi
          </el-button>
        </div>
        <div v-if="listQuestion.length > 0"
             style="align-items: flex-end; width: 100%; display: flex; justify-content: end; margin-bottom: 10px"
        >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteAllQues"
          >Xóa tất cả câu hỏi
          </el-button>
        </div>
        <el-collapse v-for="(item, idx) in listQuestion" v-model="activeNames">
          <el-collapse-item :name="idx.toString()">
            <template slot="title">
              <div style="font-weight: bold; font-size: 18px">Câu {{ idx + 1 }}</div>
            </template>
            <QuestionItem
              :question-push="item"
              :index="idx"
              :list-category="listPartSubject"
              @update-question="handleUpdateQuestion"
            />
            <div style="display: flex; flex-direction: row; margin-left: 10px; justify-content: center">
              <el-button
                :disabled="!checkAddNewQuestion()"
                type="primary"
                plain
                icon="el-icon-plus"
                @click="handleAddQuestion(idx)"
              >Thêm câu hỏi
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDelQuestion(idx)"
              >Xóa câu hỏi
              </el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
    </div>
    <el-dialog
      title="Tải ảnh lên"
      :visible.sync="dialogVisibleAddImg"
      :close-on-click-modal="false"
      width="40%"
      :before-close="handleAddImgCancel"
    >
      <file-pond
        ref="pond"
        name="file"
        label-idle="Tải lên"
        allow-remove="true"
        allow-image-preview="true"
        accepted-file-types="image/*"
        label-file-type-not-allowed="Không đúng định dạng ảnh"
        :files="myFiles"
        :server="server"
        credits="false"
        instant-upload="true"
      />
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button @click="handleAddImgCancel">Xong</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/utils/config"
import { validText } from "@/utils/validate"
import ExamAPI from "@/api/examApi"
import vueFilePond, { setOptions } from 'vue-filepond'
import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import UploadAPI from "@/api/uploadApi"
import QuestionItem from "@/views/manageExam/question/QuestionItem.vue"
import PartSubjectAPI from "@/api/partSubjectApi"
import UploadFolder from "@/views/manageExam/question/UploadFolder.vue"

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageResize
)

setOptions({
  styleLoadIndicatorPosition: "center top",
  styleProgressIndicatorPosition: "right top",
  styleButtonRemoveItemPosition: "left top",
  styleButtonProcessItemPosition: "right top",
  labelFileProcessing: 'Đang tải',
  labelTapToCancel: 'Bấm để hủy',
  labelTapToUndo: '',
  labelFileProcessingComplete: 'Thành công',
})

export default {
  components: {
    FilePond,
    QuestionItem,
    UploadFolder
  },

  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đầy đủ trường'))
      } else {
        callback()
      }
    }
    return {
      myFiles: [],
      activeNames: [],
      key: 0,
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await UploadAPI.uploadFile(file)
            if (!this.editorFocus) {
              this.formSubmit.thumbnail = data.filename
              this.editorFocus = true
            }
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      config,
      dialogVisibleAddImg: false,
      formSubmit: {
        title: '',
        subject: 1,
        active: 0,
        thumbnail: '',
        description: '',
        hasNotification: 1,
        time: 0
      },
      numberQuestion: 0,
      listTypeQuestion: [],
      formRules: {
        title: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập tiêu đề bài viết',
          validator: validateText
        }],
        content: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập nội dung bài viết',
          validator: validateText
        }],
        description: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập mô tả bài viết',
          validator: validateText
        }],
        thumbnail: [{ required: true, trigger: 'blur', message: ' ' }],
        subject: [{ required: true, trigger: 'blur', message: ' ' }]
      },
      formType: '',
      ExamId: this.$route.params.id,
      loadingNews: false,
      listQuestion: [],
      listPartSubject: []
    }
  },
  watch: {},

  async mounted() {
    this.loadingNews = true
    if (this.ExamId !== '0') {
      this.formType = 'edit'
      await this.loadFormEdit()
      await this.partSubject()
      this.addEmptyQuestion()
    } else {
      this.formType = 'create'
    }
    this.loadingNews = false
  },
  methods: {
    Uploading({ loading }) {
      this.loadingNews = loading
    },
    updateImage({ data }) {
      this.listQuestion = []
      for (const item of data) {
        this.listQuestion.push({
          content: item,
          answer: 1,
          subject: this.formSubmit.subject,
          category: this.listPartSubject.length ? this.listPartSubject[0]?._id : '',
          explanation: '',
          description: ''
        })
        this.activeNames.push(this.activeNames.length.toString())
      }
    },
    addEmptyQuestion() {
      if (this.listQuestion.length === 0) {
        this.listQuestion.push({
          content: '',
          answer: 1,
          subject: this.formSubmit.subject,
          category: '',
          explanation: '',
          description: ''
        })
        this.activeNames.push(this.activeNames.length.toString())
      } else {
        for (const index of this.listQuestion) {
          this.activeNames.push(this.activeNames.length.toString())
        }
      }
    },
    async partSubject() {
      const { data } = await PartSubjectAPI.get({ subject: this.formSubmit.subject })
      this.listPartSubject = [...data]
      for (const i of data) {
        this.listTypeQuestion.push({
          id: i._id,
          label: i.name,
          value: 0
        })
      }
    },
    async loadFormEdit() {
      try {
        this.loadingNews = true
        const data = await ExamAPI.getExamQuestionById(this.ExamId)
        this.formSubmit = { ...data }
        this.numberQuestion = data.numberQuestion
        this.listQuestion = data.questionIds
        this.loadingNews = false
      } catch (err) {
        console.log(err)
      }
    },
    async addImg() {
      if (this.formSubmit.thumbnail) {
        this.myFiles = []
      }
      this.dialogVisibleAddImg = true
    },
    handleAddImgCancel() {
      this.dialogVisibleAddImg = false
    },
    onRemoveFile() {
      this.formSubmit.thumbnail = undefined
      this.myFiles = []
    },
    handleUpdateQuestion({ question, index, cateChange }) {
      this.listQuestion[index] = {
        ...this.listQuestion[index],
        ...question
      }
      if (cateChange) {
        this.updateTypeQuestion()
      }
    },
    updateTypeQuestion() {
      for (const i in this.listTypeQuestion) {
        this.listTypeQuestion[i].value = this.listQuestion.filter((item) => item.category === this.listTypeQuestion[i].id).length
      }
    },
    async handleSend() {
      if (this.listQuestion.length === this.numberQuestion) {
        const dataSubmit = {
          ...this.formSubmit,
          listQuestion: this.listQuestion,
          listTypeQuestion: this.listTypeQuestion
        }
        try {
          this.loadingNews = true
          if (this.formType === 'create') {
            await ExamAPI.create(dataSubmit)
          } else {
            await ExamAPI.updateQuestion(dataSubmit, this.ExamId)
          }
          this.formSubmit = {}
          this.loadingNews = false
        } catch (err) {
          this.loadingNews = false
        }
        this.$router.push('/quan-ly-de-thi/danh-sach')
      }
    },
    handleCancel() {
      this.$router.push('/quan-ly-de-thi/danh-sach')
    },
    handleHTML(data) {
      this.formSubmit.content = data
    },
    checkAddNewQuestion() {
      for (const item of this.listQuestion) {
        if (item.content === '' || !item.category === '') return false
      }
      return true
    },
    handleAddQuestion(index) {
      this.listQuestion.splice(index + 1, 0, {
        content: '',
        answer: 1,
        subject: this.formSubmit.subject,
        category: '',
        explanation: '',
        description: ''
      })
      this.activeNames.push(this.activeNames.length.toString())
    },
    deleteAllQues() {
      this.listQuestion = []
    },
    handleDelQuestion(index) {
      console.log(index, this.listQuestion)
      this.listQuestion.splice(index, 1)
      console.log(index, this.listQuestion)
      this.key++
    }
  }
}
</script>

<style lang="scss">
.news-form-container {
  padding: 20px;
}

.close {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 1.6em;
  height: 1.6em;
  opacity: 0.8;
  background-color: #333;
  border-top-left-radius: 5px;

  &:hover {
    opacity: 1;
  }
}

.category-list {
  display: grid;
  flex-direction: column;
}

.one-img {
  object-fit: cover;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  width: 100%;
  max-width: 500px;
}

.container-gird {
  display: grid;
  grid-template-columns: [col1] 50% [col2] 50%;
  grid-gap: 10px;
  text-align: center;
}
</style>
