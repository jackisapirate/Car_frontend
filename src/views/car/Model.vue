<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.name"
            placeholder="Car Model"
            clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getCarModelList">Search</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-if="hasAuth('car:model:save')">Add</el-button>
      </el-form-item>
    </el-form>

<!--add-edit    -->
    <el-dialog
        :title="prompt"
        :visible.sync="dialogVisible"
        width="620px"
        :before-close="handleClose"
        @close = "handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="Model Name" prop="name" label-width="120px">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Make Name" prop="make"  label-width="120px">
          <el-select v-model="editForm.carMakeId" clearable placeholder="Please select one Make">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Cars Count" prop="carCount" label-width="120px" v-if="editFlag">
          <el-input v-model="editForm.carCount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description" label-width="120px">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="please input description of the Model"
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
          label="Model"
          width="180">
      </el-table-column>
      <el-table-column
          prop="carMakeName"
          label="Make"
          width="180">
      </el-table-column>
      <el-table-column
          prop="carCount"
          label="Car Count"
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
          <el-button type="primary" icon="el-icon-edit" circle @click="editHandle(scope.row.id)" v-if="hasAuth('car:model:update')"></el-button>
          <el-popconfirm title="Do you want to delete this item?" @confirm="delHandel(scope.row.id)" v-if="hasAuth('car:model:delete')">
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
  name: "Model",
  data() {
    return {
      dialogVisible: false,
      editForm: {},
      editFormRules: {
        name: [
          {required: true, message: 'Please enter a name', trigger: 'blur'}
        ],
        carMakeId: [
          {required: true, message: 'Please select a Make name', trigger: 'blur'}
        ]
      },
      searchForm: {},
      tableData: [],
      currentPage: 4,
      size: 10,
      total: 401,
      prompt: "add",
      editFlag: false,
      options: [],
    }
  },
  methods: {
    onSubmit() {
      this.dialogVisible = true;
      this.prompt = "Add a new Model of car";
      this.editFlag = false;
      this.$nextTick(() => {
        this.editForm = {}
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
    getCarModelList() {
      this.$axios.get("/car/model/list", {
            params: {
              name: this.searchForm.name,
              current: this.current,
              size: this.size
            }
          }).then(res => {
        console.log(res.data.data)
        this.currentPage = res.data.data.carModelPage.current;
        this.size = res.data.data.carModelPage.size;
        this.total = res.data.data.carModelPage.total;
        this.tableData = res.data.data.carModelPage.records;
        this.options = res.data.data.carMakeList;
      })
    },
    submitForm(editForm) {
      this.$refs[editForm].validate((valid) => {
        if (valid) {
          let operation = this.editForm.id ? 'update' : 'save';
          this.$axios.post('/car/model/' + operation, this.editForm).then(res => {
            this.$message({
              showClose: true,
              message: 'Congratulations, ' + operation + ' successfully',
              type: 'success',
              onClose: () => {
                this.getCarModelList();
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
      this.$axios.get('/car/model/info/' + id).then(res => {
        this.$nextTick(() => {
          this.prompt = "Edit the Model of car"
          this.editFlag = true;
          this.editForm = res.data.data
          this.editForm.carMakeIdOld = res.data.data.carMakeId;
          this.dialogVisible = true;
        })
      })
    },
    delHandel(id){
      this.$axios.post('/car/model/delete/' + id).then(res => {
        this.editForm = res.data.data;
        this.$message({
          showClose: true,
          message: 'Congratulations, delete successfully',
          type: 'success',
          onClose: () => {
            this.getCarModelList();
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
      this.getCarModelList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getCarModelList();
    }
  },
  created() {
    this.getCarModelList();
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>


