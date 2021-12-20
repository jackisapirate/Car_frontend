<template>
  <el-container>
    <el-container>
      <el-header>
        <div class="header-Dropdown">
          <el-dropdown trigger="click" v-for="menu in menuList">
            <span class="el-dropdown-link">
              {{menu.title}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <router-link :to="item.path" v-for="item in menu.children">
                <el-dropdown-item :icon="item.icon">{{item.title}}</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <span>User Profile</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/userCenter">
                <el-dropdown-item>User Center</el-dropdown-item>
              </router-link>
              <el-dropdown-item @click.native="logout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
        <strong>Information of Used Cars</strong>
        <div class="header-Userinfo">Hello: {{ userInfo.username }}</div>
      </el-header>
      <el-main>
        <Tabs></Tabs>
        <div style="margin: 0 15px">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Tabs from "@/views/include/Tabs"

export default {
  name: 'Home',
  components: {
    Tabs
  },
  data() {
    return {
      userInfo: {
        id: '34efw4',
        username: 'Jack',
      }
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo", {
        headers:{
          Authorization: localStorage.getItem("token")
        }
      }).then(response => {
        console.log(response.data)
        this.userInfo = response.data.data;
      })
    },
    logout() {
      this.$axios.post("/logout").then(response => {
        localStorage.clear();
        sessionStorage.clear();
        this.$store.commit("resetState");
        this.$router.push("/login");
      })
    }
  },
  computed: {
    menuList: {
      get() {
        return this.$store.state.menus.menuList
      }
    }
  }
}
</script>

<style scoped>
.header-Dropdown {
  float: left;
  width: 310px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-left: 40px;
}
.header-Userinfo {
  float: right;
  width: 110px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-left: 40px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: left;
  line-height: 400px;
  height: 100vh;
}

.router-link-active {
  text-decoration: none;
}

a {
  text-decoration: none;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  padding: 0;
}
</style>
