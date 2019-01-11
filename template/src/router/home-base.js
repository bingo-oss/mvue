export default {
  meta: {
    requiresAuth: false
  },
  name: "default",
  path: "/",
  component: require("../modules/home/home"),
  children: []
}