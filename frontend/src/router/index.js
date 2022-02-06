import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store';

Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: () =>
            import ('../layouts/MainLayout.vue'),
        children: [{
                path: '/',
                component: () =>
                    import ('../views/Index.vue'),
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

// router.beforeEach((to, from, next) => {
// })

export default router