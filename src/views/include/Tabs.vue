<template>
  <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
    <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "Tabs",
  data() {
    return {
    }
  },
  computed:{
    editableTabsValue:{
      get(){
        return this.$store.state.menus.editableTabsValue;
      },
      set(val){
        this.$store.state.menus.editableTabsValue = val;
      }
    },
    editableTabs:{
      get(){
        return this.$store.state.menus.editableTabs;
      },
      set(val){
        this.$store.state.menus.editableTabs = val;
      }
    }
  },
  methods: {
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      // Lock the Home page, do not allow to delete Home
      if(targetName === 'Index'){
        return
      }
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName + '';
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      // After the window is closed, the Main Route switches to another page
      this.$router.push({name: activeName}).catch(err => {
        console.log('You have clicked on the same TAB page repeatedly')
      });
    },
    clickTab(target){
      console.log("target:" + target.name)
      console.log("editableTabsValue:" + this.$store.state.menus.editableTabsValue)
        this.$router.push({name: target.name}).catch(err => {
          console.log('You have clicked on the same TAB page repeatedly');
        })
    }
  }
}
</script>

<style scoped>

</style>
