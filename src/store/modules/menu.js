import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default ({
    state: {
        menuList: [],
        permList: [],

        // 是否获取路由
        hasRoute: false,

        // Tabs标签页数据
        editableTabsValue: 'Index',
        editableTabs: [{
            title: 'Home',
            name: 'Index'
        }]
    },
    mutations: {
        setMenuList(state, menuList){
            state.menuList = menuList
        },
        setPermList(state, perms){
            state.permList = perms
        },
        changeRouteStatus(state, hasRoute){
            state.hasRoute = hasRoute
            sessionStorage.setItem("hasRoute", hasRoute);
        },

        // 添加Tabs标签页
        addTab(state, tab) {
            // let newTabName = ++this.tabIndex + '';
            let index = state.editableTabs.findIndex(e => e.name === tab.name);
            if(index === -1){
                console.log('添加了Tabs');
                state.editableTabs.push({
                    title: tab.title,
                    name: tab.name
                });
            }
            state.editableTabsValue = tab.name;
        },
        // 退出登录，清空清空，不要回答
        resetState: (state) =>{
            state.menuList = [];
            state.permList = [];
            state.hasRoute = false
            state.editableTabsValue = 'Index'
            state.editableTabs = [{
                title: 'Home',
                name: 'Index'
            }]
        }
    },
    actions: {
    },
})
