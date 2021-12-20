const Mock = require('mockjs')

const Random = Mock.Random

let Result = {
    code: 200,
    msg: '操作成功',
    data: null
}
Mock.mock('/getCaptcha', 'get', () => {
    Result.data = {
        token: Random.string(32),
        captchaImg: Random.dataImage('100x40', 'p7n5w')
    }
    return Result;
})

Mock.mock('/login', 'post', () => {
    // 无法模拟Header，所以没办法模拟jwt，只是返回接口状态
    // 模拟后台登录错误 code400
    Result.code = 400;
    Result.msg = "验证码错误"
    return Result;
})

// Mock.mock('/sys/userInfo', 'get', () => {
//     console.log("进入mock的/sys/userInfo方法");
//     Result.data = {
//         id: 'nt54hs',
//         name: 'Pirate',
//         avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
//     }
//     return Result;
// })

Mock.mock('/logout', 'post', () => {

    return Result;
})

Mock.mock('/sys/menu/nav', 'get', () => {

    let nav = [
        {
            name: 'SysManage',
            title: '系统管理',
            icon: 'el-icon-s-operation',
            component: '',
            path: '',
            children: [
                {
                    name: 'SysUser',
                    title: '用户管理',
                    icon: 'el-icon-s-custom',
                    component: 'sys/User',
                    path: '/sys/user',
                    children: []
                },
                {
                    name: 'SysRole',
                    title: '角色管理',
                    icon: 'el-icon-s-check',
                    component: 'sys/Role',
                    path: '/sys/role',
                    children: []
                },
                {
                    name: 'SysMenu',
                    title: '菜单管理',
                    icon: 'el-icon-notebook-2',
                    component: 'sys/Menu',
                    path: '/sys/menu',
                    children: []
                }
            ]
        },
        {
            name: 'SysTool',
            title: '系统工具',
            icon: 'el-icon-s-tools',
            component: '',
            path: '',
            children: [
                {
                    name: 'SysDict',
                    title: '数字字典',
                    icon: 'el-icon-s-order',
                    component: '',
                    path: '/sys/dicts',
                    children: []
                }
            ]
        }
    ]
    let authorities = ['sys:user:save', 'sys:user:delPatch'];
    Result.data = {
        nav: nav,
        authorities: authorities
    }
    return Result;
})

// menu
Mock.mock('/sys/menu/list', 'get', () => {

    Result.data = [{
        id: 1,
        create: "2021-01-15T18:34:23",
        updated: "2021-01-15T18:34:34",
        perms: 'sys:manage',
        parentId: 0,
        path: "",
        component: '',
        name: '管理系统',
        icon: 'el-icon-s-operation',
        type: 1,
        status: 0,
        orderNum: 1,
        children: [{
            id: 6,
            create: "2021-01-15T18:34:23",
            updated: "2021-01-15T18:34:34",
            perms: 'sys:manage',
            parentId: 0,
            path: "",
            component: '',
            name: '角色管理',
            icon: 'el-icon-s-operation',
            type: 1,
            status: 0,
            orderNum: 1
        }]
    }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        type: 0,
        status: 1,
        orderNum: 9
    }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        type: 2,
        status: 1,
        children: [{
            id: 31,
            date: '2016-05-03',
            name: '王小虎children',
            address: '上海市普陀区金沙江路 1516 弄',
            type: 2,
            status: 1,
            orderNum: 39
        }],
        orderNum: 6
    }]
    return Result;
})

Mock.mock(RegExp('/sys/menu/info/*'), 'get', () => {

    Result.data = {
        id: 6,
        create: "2021-01-15T18:34:23",
        updated: "2021-01-15T18:34:34",
        perms: 'sys:manage',
        parentId: 0,
        path: "",
        component: '',
        name: '角色管理',
        icon: 'el-icon-s-operation',
        type: 1,
        status: 0,
        orderNum: 1
    }
    return Result;
})

Mock.mock('/sys/menu/update', 'post', () => {
    return Result;
})

Mock.mock('/sys/menu/save', 'post', () => {
    return Result;
})

Mock.mock(RegExp('/sys/menu/delete/*'), 'post', () => {
    return Result;
})

// role
Mock.mock(RegExp('/sys/role/list*'), 'get', () => {

    Result.data = {
        "records": [
            {
                "id": 3,
                "created": "2021-01-04T10:09:14",
                "updated": "2021-01-04T10:09:43",
                "status": 1,
                "name": "普通用户",
                "code": "normal",
                "remark": "只有基本查看权限",
                "menuIds": []
            },
            {
                "id": 6,
                "created": "2021-01-07T10:09:14",
                "updated": "2021-01-08T03:04:43",
                "status": 1,
                "name": "超级管理员",
                "code": "admin",
                "remark": "拥有所有权限",
                "menuIds": []
            },
            {
                "id": 12,
                "created": "2021-01-07T10:09:14",
                "updated": "2021-01-08T03:04:43",
                "status": 1,
                "name": "备用管理员",
                "code": "backup",
                "remark": "拥有所有权限",
                "menuIds": []
            }
        ],
        "total": 3,
        "size": 10,
        "current": 1,
        "orders": [],
        "optimizeCountSql": true,
        "hitCount": false,
        "countId": null,
        "maxLimit": null,
        "searchCount": true,
        "pages": 1
    }
    return Result;
})

Mock.mock(RegExp('/sys/role/info/*'), 'get', () => {

    Result.data =
        {
            "id": 3,
            "created": "2021-01-04T10:09:14",
            "updated": "2021-01-04T10:09:43",
            "status": 1,
            "name": "普通用户",
            "code": "normal",
            "remark": "只有基本查看权限",
            "menuIds": [1,3,31]
        };
    return Result;
})
Mock.mock(RegExp('/sys/role/perm/*'), 'post', () => {
    return Result;
})

Mock.mock('/sys/role/update', 'post', () => {
    return Result;
})

Mock.mock('/sys/role/save', 'post', () => {
    return Result;
})

Mock.mock(RegExp('/sys/role/delete/*'), 'post', () => {
    return Result;
})


// user
Mock.mock(RegExp('/sys/user/list*'), 'get', () => {

    Result.data = {
        "records": [
            {
                "id": 1,
                "avatar": "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                "created": "2021-01-04T10:09:14",
                "updated": "2021-01-04T10:09:43",
                "status": 1,
                "username": "张三",
                "code": "normal",
                "remark": "只有基本查看权限",
                "menuIds": [],
                "roles": [{
                    "id": 12,
                    "name": "超级用户",
                }]
            },
            {
                "id": 2,
                "avatar": "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                "created": "2021-01-07T10:09:14",
                "updated": "2021-01-08T03:04:43",
                "status": 1,
                "username": "李四",
                "code": "admin",
                "remark": "拥有所有权限",
                "menuIds": [],
                "roles": [{
                    "id": 12,
                    "name": "超级用户",
                }]
            },
            {
                "id": 3,
                "avatar": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                "created": "2021-01-07T10:09:14",
                "updated": "2021-01-08T03:04:43",
                "status": 1,
                "username": "王五",
                "code": "backup",
                "remark": "拥有所有权限",
                "menuIds": [],
                "roles": [
                    {
                        "id": 3,
                        "name": "普通用户",
                    },
                    {
                        "id": 6,
                        "name": "超级管理员",
                    },
                    {
                        "id": 12,
                        "name": "备用管理员",
                    }
                ],
                "email": "wanglaowu@gmail.com",
                "phone": "1712345678",

            }
        ],
        "total": 3,
        "size": 10,
        "current": 1,
        "orders": [],
        "optimizeCountSql": true,
        "hitCount": false,
        "countId": null,
        "maxLimit": null,
        "searchCount": true,
        "pages": 1
    }
    return Result;
})
Mock.mock('/sys/user/repass', 'post', () => {
    return Result;
})
Mock.mock(RegExp('/sys/user/info/*'), 'get', () => {

    Result.data =
        {
            "id": 3,
            "avatar": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            "created": "2021-01-07T10:09:14",
            "updated": "2021-01-08T03:04:43",
            "status": 1,
            "username": "王五",
            "code": "backup",
            "remark": "拥有所有权限",
            "roleIds": [3,6],
            "roles": [
                {
                    "id": 3,
                    "name": "普通用户",
                },
                {
                    "id": 6,
                    "name": "超级管理员",
                },
                {
                    "id": 12,
                    "name": "备用管理员",
                }
            ],
            "email": "wanglaowu@gmail.com",
            "phone": "1712345678",

        };
    return Result;
})
Mock.mock('/sys/user/update', 'post', () => {
    return Result;
})

Mock.mock('/sys/user/save', 'post', () => {
    return Result;
})

Mock.mock(RegExp('/sys/user/delete/*'), 'post', () => {
    return Result;
})
