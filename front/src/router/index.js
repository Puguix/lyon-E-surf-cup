import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "homePage",
            component: () => import("../views/homePage"),
        },
        {
            path: "/home",
            name: "mainPage",
            component: () => import("../views/mainPage"),
        },
        {
            path: "/streams/:ids",
            name: "imageWall",
            component: () => import("../views/imageWall"),
        },
    ],
});
