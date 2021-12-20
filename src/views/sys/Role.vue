<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.name"
            placeholder="Role Name"
            clearable>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="getRoleList">Search</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit"  v-if="hasAuth('sys:role:save')">Add</el-button>
      </el-form-item>

      <el-form-item  v-if="hasAuth('sys:role:delete')">
        <el-popconfirm title="Are you sure to batch delete?" @confirm="delHandel(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatu">Batch Remove</el-button>
        </el-popconfirm>
      </el-form-item>

      <el-table
          border
          stripe
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>

        <el-table-column
            prop="name"
            label="User Name"
            width="120">
        </el-table-column>
        <el-table-column
            prop="code"
            label="Coding"
            width="120">
        </el-table-column>
        <el-table-column
            prop="remark"
            label="Description"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="operation"
            label="Operation">
          <template slot-scope="scope">
            <el-button type="success" @click="permHandle(scope.row.id)" v-if="hasAuth('sys:role:update')">Permission</el-button>
            <el-button type="primary" icon="el-icon-edit" circle @click="editHandle(scope.row.id)"  v-if="hasAuth('sys:role:update')"></el-button>
            <el-popconfirm title="Are you sure to batch delete?" @confirm="delHandel(scope.row.id)"  v-if="hasAuth('sys:role:delete')">
              <el-button type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        :total="total">
    </el-pagination>

    <!--add-edit window-->
    <el-dialog
        title="Prompt"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="User Name" prop="name" label-width="100px">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Coding" prop="code" label-width="100px">
          <el-input v-model="editForm.code"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="remark" label-width="100px">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">Confirm</el-button>
          <el-button @click="resetForm()">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--add-edit window-->
    <el-dialog
        title="Assign Permission"
        :visible.sync="dialogPermVisible"
        width="600px">
      <el-form :model="permForm">
        <el-tree
            :data="permMenuTree"
            show-checkbox
            node-key="id"
            :default-expand-all=true
            :check-strictly=true
            :props="defaultProps"
            ref="permTree"
            >
        </el-tree>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermVisible = false">Cancel</el-button>
        <el-button type="primary" @click="permCommit">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      searchForm: {},
      delBtlStatu: true,
      tableData: [],
      currentPage: 4,
      size: 10,
      total: 401,
      dialogVisible: false,
      dialogPermVisible: false,
      editForm: {},
      editFormRules: {
        name: [
          {required: true, message: 'Please input Role Name', trigger: 'blur'}
        ],
        code: [
          {required: true, message: 'Please input coding', trigger: 'blur'}
        ]
      },
      multipleSelection: [],
      permForm: {},
      permMenuTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
    }
  },
  methods: {
    search() {

    },
    onSubmit() {
      this.dialogVisible = true;
      this.editForm = {};
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.delBtlStatu = val.length == 0;
    },
    handleSizeChange(val) {
      this.size = val;
      this.getRoleList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getRoleList();
    },
    handleClose() {
      this.resetForm();
    },
    resetForm() {
      this.$refs["editForm"].resetFields();
      this.dialogVisible = false;
      this.editForm = {}
    },

    getRoleList() {
      this.$axios.get("/sys/role/list", {
        params: {
          name: this.searchForm.name,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data.records;
        this.currentPage = res.data.data.current;
        this.size = res.data.data.size;
        this.total = res.data.data.total;
        console.log(res.data.data);
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let operation = this.editForm.id ? 'update' : 'save';
          this.$axios.post('/sys/role/' + operation, this.editForm).then(res => {
            this.$message({
              showClose: true,
              message: 'Congratulation, ' + operation + ' successfully',
              type: 'success',
              onClose: () => {
                this.getRoleList();
              }
            });
            this.dialogVisible = false;
            this.resetForm();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    permHandle(id) {
      this.dialogPermVisible = true;
      this.$axios.get("/sys/role/info/" + id).then(res=>{
        // tree construction
        this.$refs.permTree.setCheckedKeys(res.data.data.menuIds);
        this.permForm = res.data.data;
      })
    },
    editHandle(id) {
      this.$axios.get('/sys/role/info/' + id).then(res => {
        this.editForm = res.data.data;
        this.dialogVisible = true;
      })
    },
    delHandel(id) {
      let ids = [];
      if (id) {
        ids.push(id);
      } else {
        this.multipleSelection.forEach(row => {
          ids.push(row.id);
        })
      }
      this.$axios.post('/sys/role/delete/' + ids).then(res => {
        this.editForm = res.data.data;
        this.$message({
          showClose: true,
          message: 'Congratulations, delete successfully',
          type: 'success',
          onClose: () => {
            this.getRoleList();
          }
        });
      })
    },
    permCommit(){
      var menuIds = this.$refs.permTree.getCheckedKeys();
      console.log(menuIds);
      this.$axios.post('/sys/role/perm/' + this.permForm.id, menuIds).then(res=>{
        this.$message({
          showClose: true,
          message: 'Congratulations, operate successfully',
          type: 'success',
          onClose: () => {
            this.getRoleList();
          }
        });
        this.dialogPermVisible = false;
      })

    },
  },

  created() {
    this.getRoleList();
    this.$axios.get('/sys/menu/list').then(res => {
      this.permMenuTree = res.data.data;
    })
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>
