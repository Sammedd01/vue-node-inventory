import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/login.vue";
import Register from "../views/register.vue";
import Dashboard from "../views/dashboard.vue";
import Products from "../views/products.vue";
import Suppliers from "../views/suppliers.vue";
import Purchases from "../views/purchase.vue";
import profitReport from "../views/profitReport.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/products", component: Products },
  { path: "/suppliers", component: Suppliers },
  { path: "/purchases", component: Purchases },
  { path: "/profit-report",component: profitReport,}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (!token && to.path !== "/login" && to.path !== "/register") {
    next("/login");
  } else {
    next();
  }
});

export default router;