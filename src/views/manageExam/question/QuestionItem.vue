<template>
  <div style="padding-bottom: 20px">
    <el-row>
      <el-col :xl="12" :md="12">
        <div style="padding: 0 20px">
          <h3 style="font-weight: bold">Đề bài:</h3>
          <div v-if="question.content" style="position: relative">
            <img
              :src="`${config.api.domainUpload}/${question.content}`"
              class="image-exam"
              alt=""
            >
            <span class="icon-remove-img" @click="onRemoveFile('content')"><el-icon name="error"/></span>
          </div>
          <img
            v-else
            alt=""
            src="../../../assets/images/image_placeholder.png"
            style="width: 70%; height: 250px"
            @click="addImg('content')"
          >
          <div class="el-row--flex">
            <el-button type="text" @click="addImg('content')">Thêm ảnh đề thi</el-button>
          </div>
          <h3 style="font-weight: bold">Mô tả: </h3>
          <el-input v-model="question.description" type="textarea" :min-rows="2"/>
        </div>
      </el-col>
      <el-col :xl="12" :md="12">
        <h3 style="font-weight: bold">Đáp án:</h3>
        <el-radio-group v-model="question.answer">
          <el-radio :label="1">A</el-radio>
          <el-radio :label="2">B</el-radio>
          <el-radio :label="3">C</el-radio>
          <el-radio :label="4">D</el-radio>
        </el-radio-group>
        <h3 style="font-weight: bold">Chuyên đề: </h3>
        <el-select
          v-model="question.category"
          style="display: flex; width: 100%"
          placeholder="Lựa chọn tags"
        >
          <el-option
            v-for="c in listCategory"
            :key="c._id"
            :label="c.name"
            :value="c._id"
          >
            {{ c.name }}
          </el-option>
        </el-select>
        <h3 style="font-weight: bold">Lời giải:</h3>
        <div v-if="question.explanation" style="position: relative">
          <img
            :src="`${config.api.domainUpload}/${question.explanation}`"
            class="image-exam"
            alt=""
          >
          <span class="icon-remove-img" @click="onRemoveFile('explanation')"><el-icon name="error"/></span>
        </div>
        <img
          v-else
          alt=""
          src="../../../assets/images/image_placeholder.png"
          style="width: 70%; height: 250px"
          @click="addImg('explanation')"
        >
        <div class="el-row--flex">
          <el-button type="text" @click="addImg('explanation')">Thêm ảnh lời giải</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="Tải ảnh lên"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="40%"
      :before-close="handleAddImgCancel"
    >
      <file-pond
        v-if="typeImg === 'content'"
        ref="pond"
        name="file"
        label-idle="Tải lên"
        allow-remove="true"
        allow-image-preview="true"
        accepted-file-types="image/*"
        label-file-type-not-allowed="Không đúng định dạng ảnh"
        :files="imgFile"
        :server="server"
        credits="false"
        instant-upload="true"
      />
      <file-pond
        v-else
        ref="pond"
        name="file"
        label-idle="Tải lên"
        allow-remove="true"
        allow-image-preview="true"
        accepted-file-types="image/*"
        label-file-type-not-allowed="Không đúng định dạng ảnh"
        :files="explanationFile"
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
import vueFilePond, {setOptions} from 'vue-filepond'
import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import UploadAPI from "@/api/uploadApi";

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
    FilePond
  },
  props: {
    question: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    listCategory: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      config,
      dialogFormVisible: false,
      innerVisible: false,
      imgFile: [],
      explanationFile: [],
      server: {
        process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await UploadAPI.uploadFile(file)
            if (this.typeImg === 'content') {
              this.question.content = data.filename
            } else {
              this.question.explanation = data.filename
            }
            this.dialogFormVisible = false
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      typeImg: 'content'
    }
  },
  watch: {
    'question.content': {
      handler: function (val, oldVal) {
        if (val && val !== oldVal) {
          this.handlePushQuestion()
        }
      },
      immediate: false,
      deep: true
    },
    'question.category': {
      handler: function (val, oldVal) {
        if (val && val !== oldVal) {
          this.handlePushQuestion()
        }
      },
      immediate: false,
      deep: true
    },
    'question.explanation': {
      handler: function (val, oldVal) {
        if (val && val !== oldVal) {
          this.handlePushQuestion()
        }
      },
      immediate: false,
      deep: true
    },
    'question.answer': {
      handler: function (val, oldVal) {
        if (val && val !== oldVal) {
          this.handlePushQuestion()
        }
      },
      immediate: false,
      deep: true
    },
    'question.description': {
      handler: function (val, oldVal) {
        if (val !== oldVal)
          this.handlePushQuestion()
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    checkAddNewQuestion() {
      return !(this.question?.content && this.question?.answer)
    },
    onRemoveFile(type) {
      if (type === 'content') {
        this.question.content = ''
        this.imgFile = []
      } else {
        this.question.exexplanation = ''
        this.explanationFile = []
      }
    },
    addImg(type) {
      this.typeImg = type
      this.dialogFormVisible = true
    },
    handleAddImgCancel() {
      this.dialogFormVisible = false
    },
    handlePushQuestion() {
      const {content, description, explanation, category} = this.question
      if (content && description && explanation && category) {
        return
      }
      if (this.question.content) {
        this.$emit('update-question', {question: this.question, index: this.index})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-remove-img {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 9;
  cursor: pointer;

  i {
    font-size: 24px;
    color: black;
  }
}

.icon-remove-img:hover {
  i:hover {
    color: #f56c6c;
    cursor: pointer;
  }
}

.image-exam {
  object-fit: contain;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px
}
</style>
