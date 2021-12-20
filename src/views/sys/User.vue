<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.name"
            placeholder="User Name"
            clearable>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="getUserList">Search</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-if="hasAuth('sys:user:save')">Add</el-button>
      </el-form-item>

      <el-form-item>
        <el-popconfirm title="Are you sure to batch delete?" @confirm="delHandel(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatu" v-if="hasAuth('sys:user:delete')">Batch Remove</el-button>
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
            prop="username"
            label="User Name"
            width="120">
        </el-table-column>
        <el-table-column
            prop="roleName"
            label="Role Name"
            width="120">
          <template slot-scope="scope">
            <el-tag size="small" type="info" v-for="item in scope.row.sysRoles">{{ item.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="email"
            label="Email"
            width="200"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="phone"
            label="TelePhone"
            width="170"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            label="Creation Time"
            width="200"
            show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.created }}</template>
        </el-table-column>
        <el-table-column
            prop="operation"
            label="Operation">
          <template slot-scope="scope">
            <el-button type="success" @click="roleHandel(scope.row.id)"  v-if="hasAuth('sys:user:save')">Assign Role</el-button>
            -
            <el-button type="success" @click="resetPassword(scope.row.id, scope.row.username)"  v-if="hasAuth('sys:user:save')">Reset Password</el-button>
            -
            <el-button type="primary" @click="editHandle(scope.row.id)" icon="el-icon-edit" circle  v-if="hasAuth('sys:user:update')"></el-button>
            -
            <el-popconfirm title="Are you sure to delete?" @confirm="delHandel(scope.row.id)"  v-if="hasAuth('sys:user:delete')">
              <el-button type="danger" slot="reference" icon="el-icon-delete" circle></el-button>
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
        <el-form-item label="User Name" prop="username" label-width="100px">
          <el-input v-model="editForm.username"></el-input>
          <el-alert
            title="Initial Password: 123456"
            :closable="false"
            type="info"
            style="height: 24px;width: 200px;"></el-alert>
        </el-form-item>
        <el-form-item label="Email" prop="email" label-width="100px" >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Telephone" prop="phone" label-width="100px">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">Submit</el-button>
          <el-button @click="resetForm()">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--add-edit pop-up windows-->
    <el-dialog
        title="Assign Role"
        :visible.sync="dialogPermVisible"
        width="600px">
      <el-form :model="permForm">
        <el-tree
            :data="permRoleTree"
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
  name: "User",
  data() {
    var checkEmail = (rule, value, cb) => {
      // check email
      const regEmail = /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("Please check if the email format is correct?"));
    }
    var checkPhone = (rule, value, cb) => {
      // check email
      const regEmail = /^\d{11}$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("Please check if the phone format is correct?"));
    }
    return {
      searchForm: {},
      delBtlStatu: true,
      tableData: [],
      currentPage: 1,
      size: 10,
      total: 400,
      dialogVisible: false,
      dialogPermVisible: false,
      editForm: {},
      editFormRules: {
        username: [
          {required: true, message: 'Please input user name', trigger: 'blur'}
        ],
        email: [
          {required: true, message: 'Please input e-mail', trigger: 'blur', Validator: 'checkEmail'},
          {required: true, validator: checkEmail, message: 'Please check if the email format is correct?', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: 'Please input telephone number', trigger: 'blur'},
          {required: true, validator: checkPhone, message: 'Phone number must be 11 digits', trigger: 'blur'}
        ]
      },
      multipleSelection: [],
      permForm: {},
      permRoleTree: [],
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
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getUserList();
    },
    handleClose() {
      this.dialogVisible = false;
      this.resetForm();
    },
    resetForm() {
      this.$refs["editForm"].resetFields();
      this.editForm = {}
    },

    getUserList() {
      this.$axios.get("/sys/user/list", {
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
          this.$axios.post('/sys/user/' + operation, this.editForm).then(res => {
            this.$message({
              showClose: true,
              message: 'Congratulations, ' + operation + ' successfully',
              type: 'success',
              onClose: () => {
                this.getUserList();
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
    roleHandel(id) {
      this.dialogPermVisible = true;
      this.$axios.get("/sys/user/info/" + id).then(res => {

        let roleIds =[]
        res.data.data.sysRoles.forEach(row =>{
          roleIds.push(row.id)
        })
        // specifically assigns values to tree structures
        this.$refs.permTree.setCheckedKeys(roleIds);
        this.permForm = res.data.data;
      })
    },
    resetPassword(id, username) {
      this.$confirm('To reset the Password of the user: ' + username + ' are you wanna continue?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
            this.$axios.post("/sys/user/repass", id).then(res => {
              this.$message({
                message: 'Congratulation, operate successfully!',
                type: 'success',
                showClose: true,
                onClose: () => {
                }
              });
            })
          }
      )
    },
    editHandle(id) {
      this.$axios.get('/sys/user/info/' + id).then(res => {
        this.editForm = res.data.data;
        this.dialogVisible = true;
      })
    },
    delHandel(id) {
      let ids = [];
      if (id) {
        ids.push(id);
      } else {
        // 为null
        this.multipleSelection.forEach(row => {
          ids.push(row.id);
        })
      }
      this.$axios.post('/sys/user/delete/' + ids).then(res => {
        this.editForm = res.data.data;
        this.$message({
          showClose: true,
          message: 'Congratulation, delete successfully!',
          type: 'success',
          onClose: () => {
            this.getUserList();
          }
        });
      })
    },
    permCommit() {
      var menuIds = this.$refs.permTree.getCheckedKeys();
      console.log(menuIds);
      this.$axios.post('/sys/user/role/' + this.permForm.id, menuIds).then(res => {
        this.$message({
          showClose: true,
          message: 'Congratulation, operate successfully!',
          type: 'success',
          onClose: () => {
            this.getUserList();
          }
        });
        this.dialogPermVisible = false;
      })
    },
  },

  created() {
    this.getUserList();
    this.$axios.get('/sys/role/list').then(res => {
      this.permRoleTree = res.data.data.records;
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
