import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const router = new Router({
  "mode": "history",
  routes: [
    {
      path: "/",
      redirect: "/student/login"
    },
    {
      path: "/admin/login",
      name: "AdminLogin",
      component: () => import("./views/admin/AdminLogin.vue"),
    },
    {
      path: "/admin/index",
      name: "AdminIndex",
      component: () => import("./views/admin/AdminIndex.vue"),
      meta: {identity: "admin"},
      children: [
        {
          path: "/admin/index",
          name: "Home",
          component: () => import("./views/admin/AdminHome.vue"),
          meta: {identity: "admin"},
        },
        {
          path: "/admin/info",
          name: "AdminUserInfo",
          component: () => import("./views/admin/AdminUserInfo.vue"),
          meta: {identity: "admin"}
        },
        {
          path: "/admin/building/info",
          name: "BuildingManagement",
          component: () => import("./views/admin/BuildingManagement.vue"),
          meta: {identity: "admin"}
        },
        {
          path: "/admin/change/pw",
          name: "ChangeAdminPw",
          component: () => import("./views/admin/ChangeAdminPw.vue"),
          meta: {identity: "admin"}
        },
        {
          path: "/admin/housemaster/management",
          name: "HousemasterManagement",
          component: () => import("./views/admin/HousemasterManagement.vue"),
          meta: {identity: "admin"}
        }
      ]
    },
    {
      path: "/housemaster/login",
      name: "HousemasterLogin",
      component: () => import("./views/housemaster/HousemasterLogin")
    },
    {
      path: "/housemaster/index",
      name: "HouseMasterIndex",
      component: () => import("./views/housemaster/HouseMasterIndex"),
      meta: {identity: "housemaster"},
      children: [
        {
          path: "/housemaster/index",
          name: "HouseMasterHome",
          component: () => import("./views/housemaster/HouseMasterHome"),
          meta: {identity: "housemaster"},
        },
        {
          path: "/housemaster/info",
          name: "HouseMasterInfo",
          component: () => import("./views/housemaster/HouseMasterInfo"),
          meta: {identity: "housemaster"},
        },
        {
          path: "/housemaster/change/password",
          name: "HouseMasterChangePassword",
          component: () => import("./views/housemaster/HouseMasterChangePassword"),
          meta: {identity: "housemaster"},
        },
        {
          path: "/housemaster/update/info",
          name: "HouseMasterUpdateInfo",
          component: () => import("./views/housemaster/HouseMasterUpdateInfo"),
          meta: {identity: "housemaster"},
        },
        {
          path: "/housemaster/dormitory/info",
          name: "DormitoryManagement",
          component: () => import("./views/housemaster/DormitoryManagement"),
          meta: {identity: "housemaster"},
        },
        {
          path: "/housemaster/health/info",
          name: "HealthManagement",
          component: () => import("./views/housemaster/HealthManagement"),
          meta: {identity: "housemaster"},
        },
        {
          path: "/housemaster/elecharges/info",
          name: "ElectricityCharges",
          component: () => import("./views/housemaster/ElectricityCharges"),
          meta: {identity: "housemaster"},
        },
        {
          path: "/housemaster/student/info",
          name: "StudentManagement",
          component: () => import("./views/housemaster/StudentManagement"),
          meta: {identity: "housemaster"},
        },
        {
          path: "/housemaster/notice/info",
          name: " NoticeManagement",
          component: () => import("./views/housemaster/NoticeManagement"),
          meta: {identity: "housemaster"},
        },
        {
          path: "/housemaster/dormitory/maintenance",
          name: 'DormitoryMaintenance',
          component: () => import("./views/housemaster/DormitoryMaintenance"),
          meta: {identity: 'housemaster'}
        },
        {
          path: "/housemaster/dormitory/maintenance/info",
          name: 'DormitoryMaintenanceInfo',
          component: () => import("./views/housemaster/DormitoryMaintenanceInfo"),
          meta: {identity: 'housemaster'}
        }
      ]
    },
    {
      path: "/student/login",
      name: "StudentLogin",
      component: () => import("./views/student/StudentLogin")
    },
    {
      path: "/student/index",
      name: "StudentIndex",
      component: () => import("./views/student/StudentIndex"),
      meta: {identity: "student"},
      children: [
        {
          path: "/student/info",
          name: "StudentInfo",
          component: () => import("./views/student/StudentInfo"),
          meta: {identity: "student"}
        },
        {
          path: "/student/index",
          name: "StudentHome",
          component: () => import("./views/student/StudentHome"),
          meta: {identity: "student"}
        },
        {
          path: "/student/change/password",
          name: "StudentChangePassword",
          component: () => import("./views/student/StudentChangPassword"),
          meta: {identity: "student"}
        },
        {
          path: "/student/update/info",
          name: "StudentUpdateInfo",
          component: () => import("./views/student/StudentUpdateInfo"),
          meta: {identity: "student"}
        },
        {
          path: "/student/elecharges/info",
          name: "StudentElectricityCharges",
          component: () => import("./views/student/StudentElectricityCharges"),
          meta: {identity: "student"}
        },
        {
          path: "/student/hygiene/info",
          name: "StudentHygiene",
          component: () => import("./views/student/StudentHygiene"),
          meta: {identity: "student"}
        },
        {
          path: "/student/maintenance/info",
          name: "Maintenance",
          component: () => import("./views/student/Maintenance"),
          meta: {identity: "student"}
        }
      ]
    },
    {
      path: "*",
      name: "NotFound",
      component: () => import("./views/admin/NotFound.vue")
    }
  ]
});


//vue.js前置守卫
router.beforeEach((to, from, next) => {
  if (!localStorage.getItem("token") && (to.meta.identity === "admin" || to.meta.identity === "housemaster" || to.meta.identity === "student")) {
    switch (to.meta.identity) {
      case "admin":
        return next("/admin/login");
      case "student":
        return next("/student/login");
      case "housemaster":
        return next("/housemaster/loin");
    }
  }
  next();
});

export default router;
