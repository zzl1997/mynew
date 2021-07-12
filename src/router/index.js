import VueRouter from "vue-router";
import Vue from "vue";
import HelloWorld from "../components/HelloWorld";
import addTranslation from "../components/addTranslation.vue";
Vue.use(VueRouter)

const routes = [
    {
        path: '/translate', component:addTranslation

    }, {
        path: '/hello',
        component: HelloWorld
    }
]
const router = new VueRouter({
    routes
    ,
    mode:'history'
})
export default router
