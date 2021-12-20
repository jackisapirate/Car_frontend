<template>
  <div id="app">
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/login">Login</router-link>-->
<!--    </div>-->
    <router-view/>
  </div>
</template>

<script>
export default{
  name: "App",
  watch: {
    $route(to, from){
      if(to.path != '/login'){
        let obj = {
          name: to.name,
          title: to.meta.title
        }
        this.$store.commit("addTab", obj);
      }
    }
  }
}
</script>

<style>
html,body,#app{
  height: 100%;
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  height: 100%;
  background-color: #E9EEF3;
}

#nav {
  /*padding: 30px;*/
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
