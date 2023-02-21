import Vue from "vue";
import VueRouter from "vue-router";
import UserService from "../services/UserService";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL + "admin",
    routes: [
        {
            path: "/",
            name: "login",
            component: () => import("../views-admin/userLogin"),
        },
        {
            path: "/home",
            name: "adminPage",
            component: () => import("../views-admin/adminPage"),
        },
        {
            path: "/create",
            name: "create",
            component: () => import("../views-admin/CreateSurfer"),
        },
        {
            path: "/edit/:id",
            name: "edit",
            component: () => import("../views-admin/EditSurfer"),
        },
        {
            path: "/register",
            name: "userRegister",
            component: () => import("../views-admin/userRegister"),
        },
    ],
});

router.beforeEach((to, from, next) => {
    console.log(to.name);
    if (
        to.name === "adminPage" ||
        to.name === "create" ||
        to.name === "edit" ||
        to.name === "userRegister"
    ) {
        //try to access admin part
        console.log("verifying if logged in front");
        console.log(UserService.isLogged());
        UserService.isLogged()
            .then(() => {
                console.log("authentification réussie");
                next();
            })
            .catch((e) => {
                console.log("pbm d'identification:" + e);
                next("/");
            });
    } else {
        next();
    }
});

export default router;
