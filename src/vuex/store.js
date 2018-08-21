// import Vue from 'vue'
// import Vuex from 'vuex'
//
// Vue.use(Vuex)
// // 首先声明一个状态 state
// const state = {
//     count: 0
// }
//
// // 然后给 actions 注册事件处理函数，当这个函数被触发时，将状态提交到 mutaions中处理
// const actions = {
//     increment (context) {
//         context.commit('increment')
//     },
//
//     decrement (context) {
//         context.commit('decrement')
//     }
// }
// // 更新状态
// const mutations = {
//     increment (state) {
//         state.count = state.count + 5
//     },
//     decrement (state) {
//         state.count = state.count - 3
//     }
// }
// // 获取状态信息
// const getters = {
// }
//
// // 下面这个相当关键了，所有模块，记住是所有，注册才能使用
// export default new Vuex.Store({state, mutations, getters, actions })


import Vuex from 'vuex'
import Vue from "vue";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        },
        decrement (state) {
            state.count--
        }
    },
    // 然后给 actions 注册事件处理函数，当这个函数被触发时，将状态提交到 mutaions中处理
    actions : {
        increment (context) {
            context.commit('increment')
        },
        decrement (context) {
            context.commit('decrement')
        }
    },
    getters : {

    }
})

