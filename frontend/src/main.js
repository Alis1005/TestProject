import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import "./assets/css/global.css"
import mixins from './mixins.js'
import store from './store';
Vue.config.productionTip = false
Vue.mixin(mixins)

new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app')