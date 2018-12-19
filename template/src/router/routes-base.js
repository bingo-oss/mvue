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
