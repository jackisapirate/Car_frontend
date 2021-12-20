<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-if="hasAuth('sys:menu:save')">Add</el-button>
      </el-form-item>
    </el-form>
<!--add-edit  window-->
    <el-dialog
        title="Prompt"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose"
        @close = "handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="Parent Menu" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="Please select a Parent Menu">
            <template v-for="item in tableData">
              <el-option :label="item.name" :value="item.id"></el-option>
              <template v-for="child in item.children">
                <el-option :label="child.name" :value="child.id">
                  <span>{{ "- " + child.name }}</span>
                </el-option>
              </template>
            </template>

          </el-select>
        </el-form-item>

        <el-form-item label="Menu Name" prop="name" label-width="100px">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Permission Code" prop="perms" label-width="100px">
          <el-input v-model="editForm.perms"></el-input>
        </el-form-item>
        <el-form-item label="Menu url" prop="path" label-width="100px">
          <el-input v-model="editForm.path"></el-input>
        </el-form-item>
        <el-form-item label="Type" prop="type" label-width="100px">
          <el-radio-group v-model="editForm.type">
            <el-radio :label=0>Catalog</el-radio>
            <el-radio :label=1>Menu</el-radio>
            <el-radio :label=2>Button</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="OrderNum" prop="orderNum" label-width="100px">
          <el-input-number v-model="editForm.orderNum" :min="1">1</el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">Confirm</el-button>
          <el-button @click="gobackForm()">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        stripe>
      <el-table-column
          prop="name"
          label="Name"
          width="200">
      </el-table-column>
      <el-table-column
          prop="perms"
          label="Permission"
          width="180">
      </el-table-column>
      <el-table-column
          prop="type"
          label="Type">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type === 0" type="success">Catalog</el-tag>
          <el-tag size="small" v-if="scope.row.type === 1" type="info">Menu</el-tag>
          <el-tag size="small" v-if="scope.row.type === 2" type="danger">Button</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="path"
          label="Menu Url">
      </el-table-column>
      <el-table-column
          prop="component"
          label="Menu Component">
      </el-table-column>
      <el-table-column
          prop="orderNum"
          label="OrderNum">
      </el-table-column>
      <el-table-column
          prop="operation"
          label="Operation">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editHandle(scope.row.id)"></el-button>
          <el-popconfirm title="Are you sure to delete?" @confirm="delHandel(scope.row.id)">
            <el-button type="danger" slot="reference"  icon="el-icon-delete" circle></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      dialogVisible: false,
      editForm: {},
      editFormRules: {
        parentId: [
          {required: true, message: 'Please select a parent menu', trigger: 'blur'}
        ],
        name: [
          {required: true, message: 'Please input a name', trigger: 'blur'}
        ],
        perms: [
          {required: true, message: 'Please input a permission', trigger: 'blur'}
        ],
        type: [
          {required: true, message: 'Please select a type', trigger: 'blur'}
        ],
        orderNum: [
          {required: true, message: 'Please input a OrderNum', trigger: 'blur'}
        ]
      },
      tableData: [],
      formInline: {
        user: '',
        region: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.dialogVisible = true;
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
    getMenuTree() {
      this.$axios.get("/sys/menu/list"
      ).then(res => {
        this.tableData = res.data.data;
      })
    },
    submitForm(editForm) {
      this.$refs[editForm].validate((valid) => {
        if (valid) {
          let operation = this.editForm.id ? 'update' : 'save';
          this.$axios.post('/sys/menu/' + operation, this.editForm).then(res => {
            this.$message({
              showClose: true,
              message: 'Congratulation, ' + operation + ' successfully',
              type: 'success',
              onClose: () => {
                this.getMenuTree();
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
      this.$axios.get('/sys/menu/info/' + id).then(res => {
        this.$nextTick(() => {
          this.editForm = res.data.data
          this.dialogVisible = true;
        })
      })
    },
    delHandel(id){
      this.$axios.post('/sys/menu/delete/' + id).then(res => {
        this.editForm = res.data.data;
        this.$message({
          showClose: true,
          message: 'Congratulation, delete successfully',
          type: 'success',
          onClose: () => {
            this.getMenuTree();
          }
        });
      })
    }
  },
  created() {
    this.getMenuTree();
  }
}
</script>

<style scoped>

</style>


