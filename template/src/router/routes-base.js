/**
 * 路由基础文件
 */
var routers = [
  {
    meta: {
      requiresAuth: false
    },
    name: "default",
    path: "/",
    component: "home/home.vue",
    children: [
      // 主页
      {
        name: "iframe",
        component: "common/iframe.vue",
        path: "iframe/:menuId"
      },
      {
        name: "error403",
        component: "common/error403.vue",
        path: "/error-403"
      },
      {
        name: "error",
        component: "common/error.vue",
        path: "/error"
      }
    ]
  },
  {
    name: "ssoclient",
    component: "common/ssoclient.vue",
    path: "/ssoclient"
  }
];

export default routers;
