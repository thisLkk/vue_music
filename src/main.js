import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import directive from "./plugins/directives.js"
Vue.use(VueAwesomeSwiper)

Vue.use(directive);
Vue.use(Vuex);
Vue.use(VueRouter);

Vue.config.productionTip = false;

/* eslint-disable no-new */
const routes = [{
    path: "/indexmusic",
    name: "音乐首页",
    component() {
        return System.import("./views/indexmusic/index.vue")
    }
},{
    path: "/mymusic",
    name: "我的音乐",
    component() {
        return System.import("./views/mymusic/index.vue")
    }
},{
    path: "/radiomusic",
    name: "我的电台",
    component() {
        return System.import("./views/radiomusic/index.vue")
    }
}, {
    path: '*',
    redirect: '/indexmusic'
}];
const router = new VueRouter({
    routes
});
const store = new Vuex.Store({
    state: {
        mapList:[],
        isShowAlbum:false,//专辑
        isShowPlayer:false,//列表
        album:[],//专辑歌曲存放地方
        index:0,//专辑的索引
        player:{
            // 既是专辑列表 又有热歌列表 
            album:[],
            index : null,//
            albumIndex:null//是专辑传的索引被ablum函数return出state的index
        }
    },
    mutations:{
        GETALL(state, payload){
            state.mapList = payload.mapList
        },//显示隐藏专辑
        SHOWORHIDEALBUM(state, payload){
            // 显示或隐藏专辑
            state.isShowAlbum = payload.isShowAlbum
            // 传入整张专辑列表
            state.album = payload.album
            state.index = payload.index
            // 这里不要换播放专辑的下标  需要在切换的歌曲播放的的时候换专辑的下标，bug
            // state.player.albumIndex = payload.albumIndex
        },
        SHOWPLAYER(state, payload){
            state.isShowPlayer = payload.isShowPlayer
        },
        PLAYAUDIO(state, payload){
            // console.log(payload)//拿到推荐歌曲的所有项
            state.player.album = payload.album
            state.player.index = payload.index 
            // 需要在切换的歌曲播放的的时候换歌曲的下标
            state.player.albumIndex = payload.albumIndex
            state.player.playerbg = payload.playerbg
            state.player.albumImage = payload.albumImage
            state.isShowPlayer = payload.isShowPlayer 
        },
        HIDEPLAYER(state, payload){
            state.isShowPlayer = payload.isShowPlayer 
        },
        CHANGEMUSIC(state, payload){
            state.player.index = payload.index
            state.player.playerbg = payload.playerbg
            state.player.albumImage = payload.albumImage
        },
        GONEXT(state, payload){
            state.player.index = payload.index
        }
    },
    actions:{
        async GETALL({commit}, payload){
            var data = await fetch("/api/mapList").then(res => res.json());
            commit("GETALL", data);
        }
    }
});
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
