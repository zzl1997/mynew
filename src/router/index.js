import VueRouter from "vue-router";
import Vue from "vue";
import arr_from_object from "../components/arr_from_object";
import addTranslation from "../components/addTranslation.vue";
Vue.use(VueRouter)

const routes = [
    {
        path: '/translate', component:addTranslation

    }, {
        path: '/testMetarial',
        component: arr_from_object
    }
]
const router = new VueRouter({
    routes
    ,
    mode:'history'
})
export default router
