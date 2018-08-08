import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import items from './modules/items'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    items
  },

  state: {
    imagesUrl: 'http://csgoworld.loc/storage/images/'
  },

  getters: {
    imagesUrl (state) {
      return state.imagesUrl
    }
  }
})
