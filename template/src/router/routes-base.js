import homeBase from './home-base'; 
//主页面基础路由
let home=_.cloneDeep(homeBase);
//向主页面添加基础子路由
home.children=[
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
];
var routers = [
  home,
  {
    name: "ssoclient",
    component: "common/ssoclient.vue",
    path: "/ssoclient"
  }
];
export default routers;
