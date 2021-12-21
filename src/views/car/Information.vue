<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.name"
            placeholder="Car Name"
            clearable>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getCarInformationList">Search</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-if="hasAuth('car:information:save')">Add</el-button>
      </el-form-item>
    </el-form>
<!--add-edit -->
    <el-dialog
        :title="prompt"
        :visible.sync="dialogVisible"
        width="620px"
        :before-close="handleClose"
        @close = "handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="Car Name" prop="name" label-width="120px">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Model Name" prop="carModelId"  label-width="120px">
          <el-select v-model="editForm.carModelId" clearable placeholder="Please select a Model">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Year" prop="year"  label-width="120px">
          <el-date-picker
              v-model="editForm.year"
              type="year"
              format="yyyy"
              value-format="yyyy"
              :picker-options="pickerOptions"
              placeholder="Please select a Year">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Price" prop="price" label-width="120px">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="Mileage" prop="mileage" label-width="120px">
          <el-input v-model="editForm.mileage"></el-input>
        </el-form-item>
        <el-form-item label="Body Style" prop="bodyStyle"  label-width="120px">
          <el-select v-model="editForm.bodyStyle" clearable placeholder="Select a Body Style">
            <el-option
                v-for="item in bodyStyleOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Color" prop="color" label-width="120px">
          <el-input v-model="editForm.color"></el-input>
        </el-form-item>
        <el-form-item label="Transmission" prop="transmission"  label-width="120px">
          <el-select v-model="editForm.transmission" clearable placeholder="Select a Transmission">
            <el-option
                v-for="item in transmissionOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Engine Type" prop="engineType"  label-width="120px">
          <el-select v-model="editForm.engineType" clearable placeholder="Select a Engine Type" >
            <el-option
                v-for="item in engineTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Description" prop="description" label-width="120px">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="please input description of the car"
              v-model="editForm.description">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">Submit</el-button>
          <el-button @click="gobackForm()">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--show-->
    <el-dialog
        :visible.sync="this.showFlag"
        width="80%"
        :before-close="showhandleClose">

      <el-descriptions title="Car Detail Information">
        <el-descriptions-item label="Car Name" >{{this.showForm.carInformation.name}}</el-descriptions-item>
        <el-descriptions-item label="Model Name">{{this.showForm.carModel.name}}</el-descriptions-item>
        <el-descriptions-item label="Make Name">{{this.showForm.carMake.name}}</el-descriptions-item>
        <el-descriptions-item label="Year">{{this.showForm.carInformation.year}}</el-descriptions-item>
        <el-descriptions-item label="Price">{{this.showForm.carInformation.price}}
        </el-descriptions-item>
        <el-descriptions-item label="Mileage">
          {{this.showForm.carInformation.mileage}}
        </el-descriptions-item>
        <el-descriptions-item label="Body Style">{{this.showForm.carInformation.bodyStyle}}</el-descriptions-item>
        <el-descriptions-item label="Color">{{this.showForm.carInformation.color}}</el-descriptions-item>
        <el-descriptions-item label="Transmission">{{this.showForm.carInformation.transmission}}</el-descriptions-item>
        <el-descriptions-item label="Engine Type">{{this.showForm.carInformation.engineType}}</el-descriptions-item>
        <el-descriptions-item label="Description" >{{this.showForm.carInformation.description}}</el-descriptions-item>
        <el-descriptions-item label="Make Country">{{this.showForm.carMake.country}}</el-descriptions-item>

        <el-descriptions-item label="Make Detail">{{this.showForm.carMake.description}}</el-descriptions-item>

      </el-descriptions>


      <span slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="showFlag = false">Confirm</el-button>
      </span>
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
          label="Car Name"
          width="100">
      </el-table-column>
      <el-table-column
          prop="year"
          label="Year"
          width="80">
      </el-table-column>
      <el-table-column
          prop="carModelName"
          label="Model"
          width="120">
      </el-table-column>
      <el-table-column
          prop="price"
          label="Price"
          width="100">
      </el-table-column>
      <el-table-column
          prop="mileage"
          label="Mile"
          width="100">
      </el-table-column>
      <el-table-column
          prop="bodyStyle"
          label="Body Style"
          width="100">
      </el-table-column>
      <el-table-column
          prop="color"
          label="Color"
          width="130">
      </el-table-column>
      <el-table-column
          prop="transmission"
          label="Transmission"
          width="120">
      </el-table-column>
      <el-table-column
          prop="engineType"
          label="Engine Type"
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
          <el-button type="primary" icon="el-icon-edit" circle @click="editHandle(scope.row.id)" v-if="hasAuth('car:information:update')"></el-button>
          <el-popconfirm title="Do you want to delete this item?" @confirm="delHandel(scope.row.id)" v-if="hasAuth('car:information:delete')">
            <el-button type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
          </el-popconfirm>
          -
          <el-button type="text" @click="detailHandel(scope.row.id)" v-if="hasAuth('car:information:list')">Detail</el-button>
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
  name: "Information",
  data() {
    return {
      dialogVisible: false,
      editForm: {},
      editFormRules: {
        name: [
          {required: true, message: 'Please enter a name', trigger: 'blur'}
        ],
        carModelId: [
          {required: true, message: 'Please select a Model name', trigger: 'blur'}
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
      bodyStyleOptions: [
        {id: 1, name: "SUV"},
        {id: 2, name: "Sedan"},
        {id: 3, name: "Pickup"},
        {id: 4, name: "Coupe"},
        {id: 5, name: "Hatchback"},
        {id: 6, name: "Convertible"},
        {id: 7, name: "Minivan"},
        {id: 8, name: "Wagon"},
        {id: 9, name: "Van"},
        {id: 0, name: "Unspecified"},
      ],
      transmissionOptions: [
        {id: 1, name: "Automatic"},
        {id: 2, name: "Manual"},
        {id: 0, name: "Unspecified"},
      ],
      engineTypeOptions: [
        {id: 1, name: "4 Cyl"},
        {id: 2, name: "6 Cyl"},
        {id: 3, name: "8 Cyl"},
        {id: 4, name: "12 Cyl"},
        {id: 5, name: "Electric"},
        {id: 6, name: "Rotary"},
        {id: 0, name: "Unspecified"},
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      showForm: {
        carInformation: {

        },
        carModel: {

        },
        carMake: {

        }
      },
      showFlag: false,
    }
  },
  methods: {
    onSubmit() {
      this.dialogVisible = true;
      this.prompt = "Add a new Model of car";
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
    getCarInformationList() {
      this.$axios.get("/car/information/list", {
            params: {
              name: this.searchForm.name,
              current: this.current,
              size: this.size
            }
          }).then(res => {
        console.log(res.data.data)
        this.options = res.data.data.allModel;
        if(res.data.data.carInformationDto != []){
          this.currentPage = res.data.data.carInformationDto.current;
          this.size = res.data.data.carInformationDto.size;
          this.total = res.data.data.carInformationDto.total;
          this.tableData = res.data.data.carInformationDto.records;
        }
      })
    },
    submitForm(editForm) {
      this.$refs[editForm].validate((valid) => {
        if (valid) {
          let operation = this.editForm.id ? 'update' : 'save';
          this.$axios.post('/car/information/' + operation, this.editForm).then(res => {
            this.$message({
              showClose: true,
              message: 'Congratulations, ' + operation + ' successfully',
              type: 'success',
              onClose: () => {
                this.getCarInformationList();
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
      this.$axios.get('/car/information/info/' + id).then(res => {
        this.$nextTick(() => {
          this.prompt = "Edit the Model of car"
          this.editFlag = true;
          this.editForm = res.data.data // 给表单赋值
          this.editForm.carModelIdOld = res.data.data.carModelId;
          this.dialogVisible = true;
        })
      })
    },
    delHandel(id){
      this.$axios.post('/car/information/delete/' + id).then(res => {
        this.editForm = res.data.data;
        this.$message({
          showClose: true,
          message: 'Congratulations, delete successfully',
          type: 'success',
          onClose: () => {
            this.getCarInformationList();
          }
        });
      })
    },
    detailHandel(id){
      this.$axios.post('/car/information/showDetail/' + id).then(res => {
        this.showForm = res.data.data;
        console.log(this.showForm.carInformation.name);
        this.showFlag = true;
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.delBtlStatu = val.length == 0;
    },
    handleSizeChange(val) {
      // Change the number of page numbers displayed on each page and query the background information based on the specified query information
      this.size = val;
      this.getCarInformationList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getCarInformationList();
    },
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
    showhandleClose(){
      this.showFlag = false;
    }
  },
  created() {
    this.getCarInformationList();
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>


