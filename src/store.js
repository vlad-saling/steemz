import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    steemGlobal: {}
  },
  getters: {
    steemGlobal: state => {
      return state.steemGlobal
    }
  },
  mutations: {
    steemGlobal: function (state, payload) {
      state.steemGlobal = payload.data
    }
  },
  actions: {
    steemGlobal: function (context, payload) {
      context.commit(payload)
    }
  }
})
