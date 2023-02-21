import Vue from "vue";
import App from "./views/App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import CountryFlag from "vue-country-flag";
import vueCountryRegionSelect from "vue-country-region-select";
Vue.use(vueCountryRegionSelect);
import Embed from "v-video-embed";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import VeeValidate from "vee-validate";

import "./main.css";

Vue.config.productionTip = false;
Vue.use(VeeValidate);
Vue.component("country-flag", CountryFlag);
Vue.use(Embed);
Vue.config.productionTip = false;

new Vue({
    vuetify,
    router,
    render: (h) => h(App),
}).$mount("#app");
