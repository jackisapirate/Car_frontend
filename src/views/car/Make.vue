<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.name"
            placeholder="Car Make"
            clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getCarMakeList">Search</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-if="hasAuth('car:make:save')">Add</el-button>
      </el-form-item>
    </el-form>

<!--add-edit    -->
    <el-dialog
        :title="prompt"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose"
        @close = "handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="Make Name" prop="name" label-width="100px">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Country" prop="country" label-width="100px">
          <el-input v-model="editForm.country"></el-input>
        </el-form-item>
        <el-form-item label="Models Count" prop="modelCount" label-width="100px" v-if="editFlag">
          <el-input v-model="editForm.modelCount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description" label-width="100px">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="please input description of the Make"
              v-model="editForm.description">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">Submit</el-button>
          <el-button @click="gobackForm()">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
        border
        stripe
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          prop="name"
          label="Make"
          width="180">
      </el-table-column>
      <el-table-column
          prop="country"
          label="Country"
          width="180">
      </el-table-column>
      <el-table-column
          prop="modelCount"
          label="Model Count"
          width="120">
      </el-table-column>
      <el-table-column
          prop="description"
          label="Description">
      </el-table-column>
      <el-table-column
          prop="operation"
          label="Operation"
          width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editHandle(scope.row.id)" v-if="hasAuth('car:make:update')"></el-button>
          <el-popconfirm title="Do you want to delete this item?" @confirm="delHandel(scope.row.id)" v-if="hasAuth('car:make:delete')">
            <el-button type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Make",
  data() {
    return {
      dialogVisible: false,
      editForm: {},
      editFormRules: {
        name: [
          {required: true, message: 'Please enter a name', trigger: 'blur'}
        ],
        level: [
          {required: true, message: 'Please select a level', trigger: 'blur'}
        ],
        status: [
          {required: true, message: 'Please select a state', trigger: 'blur'}
        ]
      },
      searchForm: {},
      tableData: [],
      currentPage: 4,
      size: 10,
      total: 401,
      prompt: "add",
      editFlag: false,
    }
  },
  methods: {
    onSubmit() {
      this.dialogVisible = true;
      this.prompt = "Add a new Make of car";
      this.editFlag = false;
      this.$nextTick(() => {
        this.editForm = {} // 给表单赋值
      })
    },
    handleClose() {
      this.gobackForm();
    },
    gobackForm(){
      this.$refs["editForm"].resetFields();
      this.dialogVisible = false;
      this.editForm = {}
    },
    getCarMakeList() {
      this.$axios.get("/car/make/list", {
            params: {
              name: this.searchForm.name,
              current: this.current,
              size: this.size
            }
          }).then(res => {
        console.log(res.data.data)
        this.currentPage = res.data.data.current;
        this.size = res.data.data.size;
        this.total = res.data.data.total;
        this.tableData = res.data.data.records;;
      })
    },
    submitForm(editForm) {
      this.$refs[editForm].validate((valid) => {
        if (valid) {
          let operation = this.editForm.id ? 'update' : 'save';
          this.$axios.post('/car/make/' + operation, this.editForm).then(res => {
            this.$message({
              showClose: true,
              message: 'Congratulation, ' + operation + ' successfully',
              type: 'success',
              onClose: () => {
                this.getCarMakeList();
              }
            });
            this.dialogVisible = false;
            this.gobackForm();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    editHandle(id) {
      this.$axios.get('/car/make/info/' + id).then(res => {
        this.$nextTick(() => {
          this.prompt = "Edit the Make of car"
          this.editFlag = true;
          this.editForm = res.data.data // 给表单赋值
          this.dialogVisible = true;
        })
      })
    },
    delHandel(id){
      this.$axios.post('/car/make/delete/' + id).then(res => {
        this.editForm = res.data.data;
        this.$message({
          showClose: true,
          message: 'Congratulation, delete successfully',
          type: 'success',
          onClose: () => {
            this.getCarMakeList();
          }
        });
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.delBtlStatu = val.length == 0;
    },
    handleSizeChange(val) {
      this.size = val;
      this.getCarMakeList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getCarMakeList();
    }
  },
  created() {
    this.getCarMakeList();
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>


